import { Path, Rectangle, Tool, Color } from 'paper';
import {
  IPath,
  IPoint,
  IRectangle,
  ITool,
  IToolEvent,
  ToolEventHandler,
} from '../types/types';

export class RectangleTool {
  mouseDown: IPoint;
  path: IPath;
  rect: IRectangle;
  tool: ITool;

  constructor() {
    this.tool = new Tool();
    this.tool.onMouseDown = this.onMouseDown.bind(this);
    this.tool.onMouseDrag = this.onMouseDrag.bind(this);
    // this.tool.onMouseUp = this.onMouseUp;
  }

  onMouseDown(e: IToolEvent) {
    this.mouseDown = e.downPoint;
  }

  onMouseDrag(e: IToolEvent) {
    // if(e.event.button > 0) return // only first mouse button

    this.rect = new Rectangle(e.downPoint, e.point);
    this.path = new Path.Rectangle(this.rect);
    this.path.strokeColor = new Color('red');
    this.path.fillColor = new Color(255, 0, 0, 0.2);
    // if(e.modifiers.shift) {
    //   this.react.height = this.rect.width
    // }

    // Remove this path on the next drag event:
    this.path.removeOnDrag();
  }

  onMouseUp(e: IToolEvent) {}

  activate() {
    this.tool.activate();
  }
}

export default new RectangleTool();
