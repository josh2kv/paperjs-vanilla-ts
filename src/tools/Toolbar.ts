import { ITool } from '../types/types';
import { LineTool } from './LineTool';
import { RectangleTool } from './RectangleTool';
import { RegularSelectionTool } from './RegularSelectionTool';

const defaultToolNames = [
  {
    id: 'regular-selection-tool',
    name: 'regular selection',
    usedKeys: {
      toolbar: 's',
    },
    instance: new RegularSelectionTool(),
  },
  {
    id: 'direct-selection-tool',
    name: 'direct selection',
    usedKeys: {
      toolbar: 'd',
    },
  },
  {
    id: 'rectangle-tool',
    name: 'rectangle',
    usedKeys: {
      toolbar: 'r',
    },
    instance: new RectangleTool(),
  },
  // {
  //   id: 'circle-tool',
  //   name: 'circle',
  //   usedKeys: {
  //     toolbar: 'c',
  //   },
  // },
  {
    id: 'path-tool',
    name: 'path',
    usedKeys: {
      toolbar: 'p',
    },
    instance: new LineTool(),
  },
];

class Toolbar {
  toolbarEl: HTMLElement;
  toolNames = defaultToolNames;
  activeTool = 'rectangle-tool';
  previousTool: string;
  tools: any[];

  constructor() {
    this.toolbarEl = document.getElementById('toolbar');
    this.addSwitchToolHandler();
    this.tools = defaultToolNames;
    this.setActiveStyle();
  }

  // registerTool(tool: ITool) {
  //   this.tools.push(tool);
  // }

  // getToolList() {
  //   return this.tools;
  // }

  addSwitchToolHandler() {
    this.toolbarEl.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.tool') as HTMLElement;
      if (!btn) return;

      const id = btn.dataset.toolId;
      if (id === this.activeTool) return;

      this.switchTool(id);
    });
  }

  switchTool(id: string) {
    const tool = this.tools.find(tool => tool.id === id);
    if (!tool) return;

    tool.instance.activate();

    this.previousTool = this.activeTool;
    this.activeTool = tool.id;

    this.setActiveStyle();
  }

  setActiveStyle() {
    const oldToolEl = document.getElementById(this.previousTool);
    const newToolEl = document.getElementById(this.activeTool);

    if (oldToolEl) oldToolEl.classList.toggle('active');
    if (newToolEl) newToolEl.classList.toggle('active');
  }
}

export default new Toolbar();
