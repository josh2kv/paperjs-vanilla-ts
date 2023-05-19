import * as paperjs from 'paper';
import { IPaperScope, IProject, ITool, PaperOptions } from './types/types';
import rectangleTool from './tools/RectangleTool';
import toolbar from './tools/Toolbar';

class Editor {
  paperScope: IPaperScope;
  project: IProject;
  tools: ITool[];

  constructor() {}

  init(canvasId: string, options: PaperOptions) {
    this.paperScope = paperjs;
    this.paperScope.setup(canvasId);

    this.project = paperjs.project;

    const { width, height } = options;
    Object.assign(this.paperScope.view.viewSize, {
      width,
      height,
    });
    toolbar.addSwitchToolHandler();

    document
      .getElementById('btn-clear')
      .addEventListener('click', this.clear.bind(this));

    document
      .getElementById('rectangle-tool')
      .addEventListener('click', rectangleTool.activate.bind(this));
  }

  clear() {
    this.paperScope.project.clear();
  }
}

const editor = new Editor();

export default editor;
