import { Item, Path, PathItem, Rectangle, Tool, Point, ToolEvent } from 'paper';
import { PaperScope, Project } from 'paper';

export interface ToolInfo {
  id: string;
  name: string;
}

export type ToolEventHandler = (e: IToolEvent) => void;

export interface PaperOptions {
  width: number;
  height: number;
}

export type IPaperScope = InstanceType<typeof PaperScope>;
export type IProject = InstanceType<typeof Project>;

export type IPoint = InstanceType<typeof Point>;
export type ITool = InstanceType<typeof Tool>;
export type IToolEvent = InstanceType<typeof ToolEvent>;

export type IItem = InstanceType<typeof Item>;
export type IPathItem = InstanceType<typeof PathItem>;
export type IRectangle = InstanceType<typeof Rectangle>;
// export type ICircle = InstanceType<typeof Circle>;
export type IPath = InstanceType<typeof Path>;

// export interface MEvent extends paper.Event {
//   event: Event
// }

// export interface MToolEvent extends MEvent

// export interface ScalingParams {
//   pivot: paper.Point;
//   origPivot: paper.Point;
//   corner: paper.Point;
//   origSize: paper.Point;
//   origCenter: paper.Point;
//   scaleItems: paper.Item[];
// }

// export interface BoundsParams {
//   boundsPath: paper.Path;
//   boundsScaleHandles: paper.Item[];
//   boundsRotHandles: paper.Item[];
// }
