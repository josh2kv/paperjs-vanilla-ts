import paper, { Path, PaperScope, Color, Point, Size } from 'paper';
import './style.css';

// const paperScope = new paper.PaperScope();
// console.log('🚀 > paperScope:', paperScope);
paper.setup('paper-canvas');
console.log('🚀 > paper:', paper);

var myPath = new Path();
myPath.strokeColor = new Color('black');

// This function is called whenever the user
// clicks the mouse in the view:
paper.view.onMouseDown = function (e) {
  console.log('🚀 > e:', e);
  // Add a segment to the path at the position of the mouse:
  myPath.add(e.point);
};
