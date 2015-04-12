'use strict';

$(document).ready(init);

// GLOBAL VARIABLES
var currentPlayer = 'red_piece';
var enemyPlayer = 'black_piece';
// the $ is added because source will be a jquery object
var $source;
// var $enemyStatusArr;

// FUNCTIONS
function init() {
  initBoard();
  switchUser();
  // active makes it so only the active player can select
  $('#board').on('click', '.active', select);
  // selects empty squares
  $('#board').on('click', '.possibleMove', move);
}

function addLabels($source, $target) {
  // $('.empty').text("empty");

  // GETS ALL VALID TDs
  console.log($('.valid'));
  //
  // if ($alltd.hasClass('empty')) {
  //   $td.text('empty');
  //   $alltd.css('color','red');
  //   $alltd.css('color','red');
  }

function initBoard() {
  // this grabs all tr's tht are less than 3 && the valid squares to add two classes to them
  $('#board tr:lt(3) .valid').addClass('red_piece player');
  $('#board tr:gt(4) .valid').addClass('black_piece player');
  $('#board tr:lt(5):gt(2) .valid').addClass('empty');


  $('#board > tbody > tr:nth-child(5) > td:nth-child(4)').addClass('red_piece player').removeClass('empty');
}

function switchUser() {
  // sets which player is active and enemy
  currentPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  enemyPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  // removes active (selectable) status from all active squares
  $('.valid').removeClass('active inactive selectedPiece');
  // Prepended period to respective players
  $('.' + enemyPlayer).addClass('inactive');
  $('.' + currentPlayer).addClass('active');
}

// click activates select function
function select() {
  // this is called when one particular square is selected
  // the identity of the selected square is $source
  $source = $(this);
  // this next line removes selectedPiece class from all non-selectedPiece pieces
  $('.valid').removeClass('selectedPiece');
  // selected piece gets selectedPiece class added
  $source.addClass('selectedPiece');
  $('td').removeClass('possibleMove');

  isEnemyEast($source,playerCompass());
  isEnemyWest($source,playerCompass());
  isEnemyJumpWest($source,playerCompass());
  isEnemyJumpEast($source,playerCompass());
  // console.log($source);
}


function isEnemyEast($source, compass) {
  var x = $($source).data('x') + compass.east;
  var y = $($source).data('y') + compass.north;
  var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
  $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
  return emptyBool;
}

function isEnemyWest($source, compass) {
  var x = $($source).data('x') + compass.west;
  var y = $($source).data('y') + compass.north;
  var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
  $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
  return emptyBool;
}

function isEnemyJumpEast($source, compass) {
  var x = $($source).data('x') + compass.east;
  var y = $($source).data('y') + compass.north;
  var x2 = $($source).data('x') + (compass.east * 2);
  var y2 = $($source).data('y') + (compass.north * 2);

  var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
  var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');

  if (empty2xBool && enemyBool) {
    $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleMove');
    return true;
  }
}

function isEnemyJumpWest($source, compass) {
  var x = $($source).data('x') + compass.west;
  var y = $($source).data('y') + compass.north;
  var x2 = $($source).data('x') + (compass.west * 2);
  var y2 = $($source).data('y') + (compass.north * 2);

  var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
  var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');
  console.log(enemyBool,empty2xBool);

  if (empty2xBool && enemyBool) {
    $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleMove');
    return true;

  }
}

function playerCompass(){
  var compass = {};
  compass.north = (currentPlayer === 'black_piece') ? -1 : 1;
  compass.east = (currentPlayer === 'black_piece') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;
  return compass;
}

// Chyld says: don't have to pass in $source but doing it anyway to avoid future confusion
function movePiece($source, $target) {
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}

function move() {
  // if nothing is selectedPiece then do nothing
  // we just want to exit the function if this statement is true
  if (!$source) {return;}
  var $target = $(this);
  // console.log(addLabels($source, $target));

  // these objects hold the x,y coordinates of the $source and $target
  // var src = {};
  // var tgt = {};
  //
  // // to turn the x,y numbers from strings into numbers you can use either method below
  // // src.x = $source.data('x') * 1;
  // // src.y = parseFloat($source.data('y'));
  // src.x = parseFloat($source.data('x'));
  // src.y = $source.data('y') * 1;
  // src.enemy = enemyPlayer;
  //
  // tgt.x = $target.data('x') * 1;
  // tgt.y = $target.data('y') * 1;

  // direction of movement depends on which side of the board you are on
  // var compass = {};
  // compass.north = (currentPlayer === 'black_piece') ? -1 : 1;
  // compass.east = (currentPlayer === 'black_piece') ? 1 : -1;
  // compass.west = compass.east * -1;
  // compass.south = compass.north * -1;

  // switch(moveType(src, tgt, compass, isKing)) {
  //   case 'move':
  //     console.log('move');
  //     movePiece($source,$target);
  //   // to remove selected status
  //   // $('.selectedPiece').removeClass('selectedPiece')
  //     switchUser();
  //     break;
  //
  //   case 'jump':
  //     console.log('jump');
  //     movePiece($source,$target);
  //
  //     // x, y for above was at new location of jumping piece
  //     // var jumpNum = 1;
  //     // must update src coordinates
  //     src.x = tgt.x;
  //     src.y = tgt.y;
  //
  //     // console.log('src.x',src.x,'src.y', src.y, 'tgt.x',tgt.x,'tgt.y',tgt.y);
  //     if (!(isJump(src, tgt, compass, isKing))) {
  //       switchUser();
  //     }
  // }
}



// STEP 1  - moveType function called by the switch statement on whether a  'move' or a 'jump '
function moveType(src, tgt, compass, isKing) {
  // STEP 2 - isMove function checks coordinates of selected square and the target square
  if (isMove(src, tgt, compass, isKing)) {
    return 'move';
  }
  if (isJump(src, tgt, compass, isKing)) {
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing) {
  return (
    (src.x + compass.east === tgt.x
    || src.x + compass.west === tgt.x)
    && src.y + compass.north === tgt.y
    || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing, jumpNum) {
  var enemyVars = isEnemy(src, compass);
  // these label the output identities of what enemyVars returns, i.e. a list with a boolean and a jquery enemy object
  var enemyBoolean = 0;
  var enemyObj = 1;
  // must have at least 2 conditions (1) there is an enemy in the tgt coordinate, and (2) there is an empty space two squares away along a diagona

  if (enemyVars[enemyBoolean]) {
    tgt.x = $(enemyVars[enemyObj]).data('x');
    tgt.y = $(enemyVars[enemyObj]).data('y');

    var jumpPossible = (
      (src.x + (compass.east*2) === tgt.x || src.x + (compass.west*2) === tgt.x)
      && src.y + (compass.north*2) === tgt.y
      || (isKing && src.y + (compass.south*2) === tgt.y));

    // console.log(enemyVars[1])
    if (jumpPossible) {
      $($(enemyVars[1])).removeClass('' + src.enemy +' inactive player');
      $($(enemyVars[1])).addClass('empty');
    }
  }
  return jumpPossible;
}

function findEnemy() {

}

function isEnemy(src, compass) {
  var xe = src.x + compass.east;
  var xw = src.x + compass.west;
  var yn = src.y + compass.north;
  var ys = src.y + compass.south;

  var  enemyStatusArr = [];
  var $enemies = $('.inactive');

  for (var i = 0; i<$enemies.length; i++) {
    var $enemy = $($enemies[i]);

    var ex = $enemy.data('x');
    var ey = $enemy.data('y');
    console.log('loop',ex,ey,'xe,xw,yn,ys',xe,xw,yn,ys);

    if ((xe === $enemy.data('x') || xw === $enemy.data('x'))
      && yn === $enemy.data('y') || (isKing && ys === $enemy.data('y'))) {

        enemyStatusArr.push(true);
        enemyStatusArr.push($enemies[i]);
    }
  }
  console.log('is enemy?', enemyStatusArr[0], 'final xy',ex,ey,'xe,xw,yn,ys',xe,xw,yn,ys);

  return  enemyStatusArr;
}

function isKing () {
  // you can use either of the two lines below to check whether piece is a king or not
  // note that one has to specify that king is a class when using .is
  // var isKing = $source.hasClass('king');
  // var isKing = $source.is('.king');
}
