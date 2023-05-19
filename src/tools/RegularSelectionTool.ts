import paper, { Tool, Point, Path, Color } from 'paper';
import editor from '../Editor';
import { hitOptions } from '../config';
import { isPath } from '../helpers';
import { HandlePosition, SelectionMode } from '../types/enums';

export class RegularSelectionTool {
  mouseDown: paper.Point;
  path: paper.Path;
  rect: paper.Path.Rectangle;
  tool: paper.Tool;
  mode = SelectionMode.None;
  selectionRect: paper.Path.Rectangle;

  pivot: paper.Point;
  origPivot: paper.Point;
  corner: paper.Point;
  origSize: paper.Point;
  origCenter: paper.Point;
  scaleItems: paper.Item[];

  boundsPath: paper.Path.Rectangle;
  boundsScaleHandles: paper.Item[];
  boundsRotHandles: paper.Item[];

  constructor() {
    this.tool = new Tool();
    this.tool.onMouseDown = this.onMouseDown.bind(this);
    this.tool.onMouseDrag = this.onMouseDrag.bind(this);
    this.tool.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown(e: paper.ToolEvent) {
    // if (e.event.button > 0) return; // only first mouse button

    const hitResult = editor.project.hitTest(e.point, hitOptions);

    // 빈 공간을 클릭한 경우
    if (!hitResult) {
      this.setSelectionMode(SelectionMode.Rectangular);
      return;
    }

    // 스케일링 컨트롤을 클릭한 경우
    if (hitResult.item?.data.isScaleHandle) {
      this.setSelectionMode(SelectionMode.Scale);
      const { index } = hitResult.item.data;

      this.origPivot =
        this.boundsPath.bounds[
          this.getOpposingRectCornerNameByIndex(index)
        ].clone();
      this.pivot = this.pivot.clone();
      this.corner =
        this.boundsPath.bounds[this.getRectCornerNameByIndex[index]].clone();
      this.origSize = this.corner.subtract(this.pivot);
      this.origCenter = this.boundsPath.bounds.center;
      this.scaleItems = this.getSelectedItems();
    }

    this.mode = SelectionMode.Move;
    this.setSelectionBounds();
  }

  onMouseDrag(e: paper.ToolEvent) {
    if (this.mode === SelectionMode.Rectangular) {
      this.selectionRect = this.rectSelect(e);
      this.selectionRect.removeOnDrag();
      return;
    }
  }

  onMouseUp(e: paper.ToolEvent) {
    if (this.mode === SelectionMode.Rectangular && this.selectionRect) {
      this.processRectSelection(e);
      this.selectionRect.remove();
    }

    this.mode = SelectionMode.None;
    this.selectionRect = null;

    console.log('paper: ', paper);
  }

  activate() {
    this.tool.activate();
  }

  setSelectionMode(mode: SelectionMode) {
    this.mode = mode;
  }

  processRectSelection(e: paper.ToolEvent) {
    const allItems = this.getAllPaperItems();

    allItems.forEach(item => {
      this.handleRectSelectionItem(item);
    });
  }

  handleRectSelectionItem(item: paper.Item) {
    if (isPath(item)) {
      let shouldIntersectionsCheck = true;

      item.segments.forEach(segment => {
        if (this.selectionRect.contains(segment.point)) {
          this.setItemSelection(item, true);
          shouldIntersectionsCheck = false;
          return;
        }
      });

      if (!shouldIntersectionsCheck) return;

      const intersections = item.getIntersections(this.rect);
      if (intersections.length > 0) {
        this.setItemSelection(item, true);
      }

      return;
    }
  }

  setItemSelection(item: paper.Path, selected: boolean) {
    // fully selected segments need to be unselected first
    item.fullySelected = false;
    // then the item can be normally selected
    item.selected = selected;
  }

  getSelectedItems() {
    return paper.project.selectedItems;
  }

  getAllPaperItems(includeGuides = false) {
    const allItems = [];

    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];

      for (let j = 0; j < layer.children.length; j++) {
        const child = layer.children[j];
        // if(!includeGuides && child.guide) { continue; }
        if (!includeGuides && child?.data.isHelperItem) continue;

        allItems.push(child);
      }
    }

    return allItems;
  }

  rectSelect(e: paper.ToolEvent) {
    const half = new Point(0.5 / paper.view.zoom, 0.5 / paper.view.zoom);
    const start = e.downPoint.add(half);
    const end = e.point.add(half);
    const rect = new Path.Rectangle(start, end);
    const zoom = 1.0 / paper.view.zoom;
    this.setDefaultGuideStyle(rect);
    // rect.parent = pg.layer.getGuideLayer();
    rect.strokeColor = new Color('#6a6a6a');
    rect.data.isRectSelect = true;
    rect.data.isHelperItem = true;
    rect.dashArray = [3.0 * zoom, 3.0 * zoom];

    return rect;
  }

  setDefaultGuideStyle(item) {
    item.strokeWidth = 1 / paper.view.zoom;
    item.opacity = 1;
    item.blendMode = 'normal';
    item.guide = true;
  }

  getOpposingRectCornerNameByIndex(index: number) {
    switch (index) {
      case 0:
        return HandlePosition.TopRight;
      case 1:
        return HandlePosition.RightCenter;
      case 2:
        return HandlePosition.BottomRight;
      case 3:
        return HandlePosition.BottomCenter;
      case 4:
        return HandlePosition.BottomLeft;
      case 5:
        return HandlePosition.LeftCenter;
      case 6:
        return HandlePosition.TopLeft;
      case 7:
        return HandlePosition.TopCenter;
    }
  }

  getRectCornerNameByIndex(index: number) {
    switch (index) {
      case 0:
        return HandlePosition.BottomLeft;
      case 1:
        return HandlePosition.LeftCenter;
      case 2:
        return HandlePosition.TopLeft;
      case 3:
        return HandlePosition.TopCenter;
      case 4:
        return HandlePosition.TopRight;
      case 5:
        return HandlePosition.RightCenter;
      case 6:
        return HandlePosition.BottomRight;
      case 7:
        return HandlePosition.BottomCenter;
    }
  }

  setSelectionBounds() {
    this.removeBoundsPath();

    const items = this.getSelectedItems();
    if (!items.length) return;

    let rect: paper.Rectangle;

    for (const item of items) {
      if (!rect) {
        rect = item.bounds;
        continue;
      }

      rect = rect.unite(item.bounds);
    }

    if (!this.boundsPath) {
      this.boundsPath = new paper.Path.Rectangle(rect);
      this.boundsPath.curves[0].divideAtTime(0.5);
      this.boundsPath.curves[2].divideAtTime(0.5);
      this.boundsPath.curves[4].divideAtTime(0.5);
      this.boundsPath.curves[6].divideAtTime(0.5);
    }
    console.log('🚀 > this.boundsPath:', this.boundsPath);

    this.boundsPath.guide = true;
    // this.boundsPath.data.isSelectionBound = true;
    // this.boundsPath.data.isHelperItem = true;
    // this.boundsPath.fillColor = null;
    // this.boundsPath.strokeScaling = false;
    // this.boundsPath.fullySelected = true;
    // this.boundsPath.parent = pg.layer.getGuideLayer();

    // jQuery.each(this.boundsPath.segments, function (index, segment) {
    //   var size = 4;

    //   if (index % 2 === 0) {
    //     size = 6;
    //   }

    //   if (index === 7) {
    //     var offset = new Point(0, 10 / paper.view.zoom);
    //     boundsRotHandles[index] = new paper.Path.Circle({
    //       center: segment.point + offset,
    //       data: {
    //         offset: offset,
    //         isRotHandle: true,
    //         isHelperItem: true,
    //         noSelect: true,
    //         noHover: true,
    //       },
    //       radius: 5 / paper.view.zoom,
    //       strokeColor: pg.guides.getGuideColor('blue'),
    //       fillColor: 'white',
    //       strokeWidth: 0.5 / paper.view.zoom,
    //       parent: pg.layer.getGuideLayer(),
    //     });
    //   }

    //   boundsScaleHandles[index] = new paper.Path.Rectangle({
    //     center: segment.point,
    //     data: {
    //       index: index,
    //       isScaleHandle: true,
    //       isHelperItem: true,
    //       noSelect: true,
    //       noHover: true,
    //     },
    //     size: [size / paper.view.zoom, size / paper.view.zoom],
    //     fillColor: pg.guides.getGuideColor('blue'),
    //     parent: pg.layer.getGuideLayer(),
    //   });
    // });
  }

  removeBoundsPath() {
    this.removeHelperItems();
    this.boundsPath = null;
    // this.boundsScaleHandles.length = 0;
    // this.boundsRotHandles.length = 0;
  }

  removeHelperItems() {
    this.removePaperItemsByDataTags(['isHelperItem']);
  }

  removePaperItemsByDataTags(tags: string[]) {
    const allItems = this.getAllPaperItems(true);

    allItems.forEach(item => {
      tags.forEach(tag => {
        if (item?.data[tag]) {
          item.remove();
        }
      });
    });
  }
}

export default new RegularSelectionTool();
