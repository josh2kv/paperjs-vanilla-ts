// import paper, { Path, PaperScope, Color, Point, Size } from 'paper';

// const paperScope = new paper.PaperScope();
// console.log('🚀 > paperScope:', paperScope);
// paper.setup('paper-canvas');

import './style.css';
import editor from './Editor';

editor.init('paper-canvas', { width: 1000, height: 600 });
