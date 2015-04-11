'use strict';

$(document).ready(init);

var currentPlayer = 'red_piece';
var enemyPlayer = 'black_piece';

// the $ is added because source will be a jquery object
var $source;

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

  // sets which player is active and enemy
  currentPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  enemyPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  // if (currentPlayer === 'red_piece') {
  //   enemyPlayer = 'black_piece';
  // } else {
  //   enemyPlayer = 'red_piece';
  // }

  // removes active (selectable) status from all active squares
  $('.valid').removeClass('active inactive selectedPiece');
  $('.' + enemyPlayer).addClass('inactive');
  // Prepended period to whomever is the currentPlayer player
  $('.' + currentPlayer).addClass('active');

}


// click activates select function
function select() {
  // this is called when one particular square is selected
  // alert('hiya');

  // the identity of the selected square is $source
  $source = $(this);
  // this next line removes selectedPiece class from all non-selectedPiece pieces
  //
  $('.valid').removeClass('selectedPiece');
  // selected piece gets selectedPiece class added
  $source.addClass('selectedPiece');
}

function move() {
  // if nothing is selectedPiece then do nothing
  if (!$source) {
    // we just want to exit the function if this statement is true
    return;
  }
  var $target = $(this);

  // var $enemies = $('.inactive');

  // these objects hold the x,y coordinates of the $source and $target
  var src = {};
  var tgt = {};

  // to turn the x,y numbers from strings into numbers you can use either method below
  // src.x = $source.data('x') * 1;
  // src.y = parseFloat($source.data('y'));
  src.x = $source.data('x') * 1;
  src.y = parseFloat($source.data('y'));
  tgt.x = parseFloat($target.data('x'));
  tgt.y = $target.data('y') * 1;
  // console.log(src,tgt);

  // direction of movement depends on which side of the board you are on
  var compass = {};
  compass.north = (currentPlayer === 'black_piece') ? -1 : 1;
  compass.east = (currentPlayer === 'black_piece') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)) {
    case 'move':
      movePiece($source,$target);
      console.log('move');
      switchUser();
      break;
    case 'jump':
      movePiece($source,$target);

      console.log('jump');
      break;
  }
}

// STEP 1  - moveType function called by the switch statement on whether a  'move' or a 'jump '
function moveType(src, tgt, compass, isKing) {
  // STEP 2 - isMove function checks coordinates of selected square and the target square
  if (isMove(src, tgt, compass, isKing)) {
    return 'move';
  }
  if (isJump(src, tgt, compass, isKing)) {
    // console.log(isJump(src, tgt, compass, isKing);
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing) {
  console.log(src, tgt);
  // debugger;
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x && src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing) {
  // must have at least 2 conditions (1) there is an enemy in the tgt coordinate, and (2) there is an empty space two squares away along a diagona
  var JumpPossible = (
    src.x + (compass.east*2) === tgt.x
  || src.x + (compass.west*2) === tgt.x
  // && src.x + compass.east === enemy.x
  && src.y + (compass.north*2) === tgt.y
  || (isKing && src.y + (compass.south*2) === tgt.y)
  // && src.x + compass.west === enemy.x
  && isEnemy(src, compass));

  console.log(isEnemy(src, compass));
  return JumpPossible;
}

function isEnemy(src, compass) {
  // var x = src.x + compass.east;
  // var y = 0;
  //
  // var enemyExist = 0;
  //
  // var enemies = $('.inactive');
  //
  //
  // $v = $("td[data-x='6'][data-y='1']")
  // $v = $("td[data-x=" + x + "][data-y=" + y + "]")
  //
  // $v.addClass('red_piece')
  // $v.removeClass('red_piece')
  // $v.data('x')
  // $v.data('y')
  //
  // for (var i= 0; i<enemies.length ; i++) {
  //   x = enemies[i].data('x');
  //   y = enemies[i].data('y');
  //   console.log(x,y);
  //
  //   if (src.x + compass.east === x || src.x + compass.west === x && src.y + compass.north === y || (isKing && src.y + (compass.south === y))) {
  //     // enemyExist
  //     enemies[i].removeClass('red_piece');
  //     // console.log(i);
  //
  //
  //   }
  // }
}


  // while (src.x )
  // enemy.x = $enemies.data('x') * 1;
  // enemy.y = $enemies.data('y') * 1;
  // $('.enemies').
  // enemy.x = parseFloat($target.data('x'));
  // enemy.y = $target.data('y') * 1;


function isKing () {
  // you can use either of the two lines below to check whether piece is a king or not
  // note that one has to specify that king is a class when using .is
  var isKing = $source.hasClass('king');
  // var isKing = $source.is('.king');
}

// don't have to pass in $source but doing it anyway to resolve future confusion
function movePiece($source, $target) {
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}
