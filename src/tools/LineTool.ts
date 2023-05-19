import { Path, Rectangle, Tool, Color } from 'paper';
import {
  IPath,
  IPoint,
  IRectangle,
  ITool,
  IToolEvent,
  ToolEventHandler,
} from '../types/types';

export class LineTool {
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
    this.path = new Path();
    this.path.strokeColor = new Color('green');
    // this.path.fillColor = new Color(0, 255, 0, 0.2);
    this.path.add(e.point);
  }

  onMouseDrag(e: IToolEvent) {
    this.path.add(e.point);

    // Remove this path on the next drag event:
    // this.path.removeOnDrag();
  }

  onMouseUp(e: IToolEvent) {}

  activate() {
    this.tool.activate();
  }
}

export default new LineTool();
