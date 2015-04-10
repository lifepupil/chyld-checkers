'use strict';

$(document).ready(init);

var current = 'red_piece';
// the $ is added because source will be a jquery object
var $source;
var $destination;

function init() {
  initBoard();
  switchUser();
  // active makes it so only the active player can select
  $('#board').on('click', '.active', select);
  // selects empty squares
  $('#board').on('click', '.empty', move);

}

function initBoard() {
  // this grabs all tr's tht are less than 3 && the valid squares to add two classes to them
  $('#board tr:lt(3) .valid').addClass('red_piece player');
  $('#board tr:gt(4) .valid').addClass('black_piece player');
  $('#board tr:lt(5):gt(2) .valid').addClass('empty');

}

function switchUser() {
  current = (current === 'red_piece') ? 'black_piece' : 'red_piece';
  $('.valid').removeClass('active selected');
  // this prepends a period to whomever is the current player
  $('.' + current).addClass('active');
}

function select() {
  // alert('hiya');
  $source = $(this);
  // this next line removes selected class from all non-selected pieces
  $('.valid').removeClass('selected');
  // selected piece gets selected class added
  $source.addClass('selected');

}

function move() {
  // if nothing is selected then do nothing
  if (!$source) {
    // we just want to exit the function if this statement is true
    return;
  }
  var $target = $(this);
  // you can use either of the two lines below to check whether piece is a king or not
  var isKing = $source.hasClass('king');
  // note that one has to specify that king is a class when using .is
  // var isKing = $source.is('.king');

  // these objects hold the x,y coordinates of the $source and $target
  var src = {};
  var tgt = {};

  // to turn the x,y numbers from strings into numbers you can use either method below
  src.x = $source.data('x') * 1;
  src.y = parseFloat($source.data('y'));
  tgt.x = parseFloat($target.data('x'));
  tgt.y = $target.data('y') * 1;

  // console.log(src,tgt);

  // direction of movement depends on which side of the board you are on
  var compass = {};
  compass.north = (current === 'black_piece') ? -1 : 1;
  compass.east = (current === 'black_piece') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)) {
    case 'move':
      movePiece($source,$target);
      // console.log('move');

      switchUser();
      break;
    case 'jump':
      console.log('jump');
      break;
  }
}

function moveType(src, tgt, compass, isKing) {
  if (isMove(src, tgt, compass, isKing)) {
    return 'move';
  }
  if (isJump(src, tgt, compass, isKing)) {
    return 'jump';
  }

}

function isMove(src, tgt, compass, isKing) {
  console.log(src, tgt);
  // debugger;
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x && src.y + compass.north === tgt.y && (isKing && src.y + compass.south === tgt.y));

}

function isJump(src, tgt, compass, isKing) {}

function isEnemy(){}

// don't have to pass in $source but doing it anyway to resolve future confusion
function movePiece($source, $target) {
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}
