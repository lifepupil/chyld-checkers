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
  $('#board').on('click', '.possibleJump', move);

}

function computerPlayer(){
  // first must
  var whichPiece = Math.floor((Math.random($('.red_piece').length * 10) + 1));
  var thisPiece = $('.red_piece')[whichPiece];
  var whichMove = Math.floor((Math.random($('.red_piece').length * 2) + 1));

}

function initBoard() {
  // this grabs all tr's tht are less than 3 && the valid squares to add two classes to them

  // $('#board .valid').addClass('empty');
  // $('#board tr:lt(2):gt(0) .valid').addClass('red_piece player');
  // $('#board tr:lt(2):gt(0) .valid').toggleClass('empty');
  // $('#board tr:gt(4) .valid').addClass('black_piece player');
  // $('#board tr:gt(4) .valid').toggleClass('empty');

  $('#board tr:lt(3) .valid').addClass('red_piece player');
  $('#board tr:gt(4) .valid').addClass('black_piece player');
  $('#board tr:lt(5):gt(2) .valid').addClass('empty');

  // this is only for debugging purposes
  $('#board > tbody > tr:nth-child(5) > td:nth-child(4)').addClass('red_piece player').removeClass('empty');
  $('#board > tbody > tr:nth-child(2) > td:nth-child(5)').addClass('empty').removeClass('red_piece player');
  $('#board > tbody > tr:nth-child(1) > td:nth-child(4)').addClass('empty').removeClass('red_piece player');
  $('#board > tbody > tr:nth-child(8) > td:nth-child(5)').addClass('empty').removeClass('black_piece player');
}

function switchUser() {
  // sets which player is active and enemy
  currentPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  enemyPlayer = (currentPlayer === 'red_piece') ? 'black_piece' : 'red_piece';
  // removes active (selectable) status from all active squares
  $('.valid').removeClass('active inactive selectedPiece possibleJump possibleMove');
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
  $('td').removeClass('possibleMove possibleJump');

  //evaluate what the possible moves are
  evaluateMoves();
}

function evaluateMoves() {
  var movesObj = {};
  movesObj.enemyEast = isEnemyEast($source,playerCompass());
  movesObj.enemyWest = isEnemyWest($source,playerCompass());
  movesObj.enemyJumpEast = isEnemyJumpEast($source,playerCompass());
  movesObj.enemyJumpWest = isEnemyJumpWest($source,playerCompass());
  movesObj.enemyEastKing = isEnemyEastKing($source,playerCompass());
  movesObj.enemyWestKing = isEnemyWestKing($source,playerCompass());
  movesObj.enemyJumpEastKing = isEnemyJumpEastKing($source,playerCompass());
  movesObj.enemyJumpWestKing = isEnemyJumpWestKing($source,playerCompass());

  return movesObj;
}

function isEnemyEast($source, compass) {
  var x = $($source).data('x') + compass.east;
  var y = $($source).data('y') + compass.north;
  var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
  if (emptyBool) {
    $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
  }
  return emptyBool;
}

function isEnemyEastKing($source, compass) {
  var whichKing = (currentPlayer === 'red_piece') ? 'red_king' : 'black_king';
  var kingness = $source.hasClass(whichKing);
  console.log(whichKing,kingness)
  if (kingness) {
    var x = $($source).data('x') + compass.east;
    var y = $($source).data('y') + compass.south;
    var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
    if (emptyBool) {
      $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
    }
    return emptyBool;
  } else {
    return false;
  }
}

function isEnemyWest($source, compass) {
  var x = $($source).data('x') + compass.west;
  var y = $($source).data('y') + compass.north;
  var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
  if (emptyBool) {
    $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
  }
  return emptyBool;
}

function isEnemyWestKing($source, compass) {
  var whichKing = (currentPlayer === 'red_piece') ? 'red_king' : 'black_king';
  var kingness = $source.hasClass(whichKing);

  if (kingness) {
    var x = $($source).data('x') + compass.west;
    var y = $($source).data('y') + compass.south;

    // tests if the possible move is empty
    var emptyBool = $('[data-x='+x+'][data-y='+y+']').hasClass('empty');
    if (emptyBool) {
      $('[data-x='+x+'][data-y='+y+']').addClass('possibleMove');
    }
    return emptyBool;
  // not a king
  } else {
    return false;
  }
}

function isEnemyJumpEast($source, compass) {
  var x = $($source).data('x') + compass.east;
  var y = $($source).data('y') + compass.north;
  var x2 = $($source).data('x') + (compass.east * 2);
  var y2 = $($source).data('y') + (compass.north * 2);

  // the line $('[data-x='+x+'][data-y='+y+']') grabs only the td that satisfies x and y values
  var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
  var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');

  if (empty2xBool && enemyBool) {
    $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleJump');
    $('[data-x='+x+'][data-y='+y+']').addClass('jumpedPiece');
    return true;
  } else {
    return false;
  }
}

function isEnemyJumpWestKing($source, compass) {
    var whichKing = (currentPlayer === 'red_piece') ? 'red_king' : 'black_king';
    var kingness = $source.hasClass(whichKing);

    if (kingness) {
      var x = $($source).data('x') + compass.west;
      var y = $($source).data('y') + compass.south;
      var x2 = $($source).data('x') + (compass.west * 2);
      var y2 = $($source).data('y') + (compass.south * 2);

      // the line $('[data-x='+x+'][data-y='+y+']') grabs only the td that satisfies x and y values
      var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
      var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');

      if (empty2xBool && enemyBool) {
        $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleJump');
        $('[data-x='+x+'][data-y='+y+']').addClass('jumpedPiece');
        return true;
      } else {
        return false;
      }
    // this is if the source piece is not a kind
    } else {
      return false;
  }
}


function isEnemyJumpEastKing($source, compass) {
    var whichKing = (currentPlayer === 'red_piece') ? 'red_king' : 'black_king';
    var kingness = $source.hasClass(whichKing);

    if (kingness) {
      var x = $($source).data('x') + compass.east;
      var y = $($source).data('y') + compass.south;
      var x2 = $($source).data('x') + (compass.east * 2);
      var y2 = $($source).data('y') + (compass.south * 2);

      // the line $('[data-x='+x+'][data-y='+y+']') grabs only the td that satisfies x and y values
      var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
      var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');

      if (empty2xBool && enemyBool) {
        $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleJump');
        $('[data-x='+x+'][data-y='+y+']').addClass('jumpedPiece');
        return true;
      } else {
        return false;
      }
    // this is if the source piece is not a kind
    } else {
      return false;
  }
}


function isEnemyJumpWest($source, compass) {
  var x = $($source).data('x') + compass.west;
  var y = $($source).data('y') + compass.north;
  var x2 = $($source).data('x') + (compass.west * 2);
  var y2 = $($source).data('y') + (compass.north * 2);

  var enemyBool = $('[data-x='+x+'][data-y='+y+']').hasClass(enemyPlayer);
  var empty2xBool = $('[data-x='+x2+'][data-y='+y2+']').hasClass('empty');

  if (empty2xBool && enemyBool) {
    $('[data-x='+x2+'][data-y='+y2+']').addClass('possibleJump');
    $('[data-x='+x+'][data-y='+y+']').addClass('jumpedPiece');
    return true;
  } else {
    return false;
  }
}

function playerCompass(){
// dont't need to pass any arguments because currentPlayer and enemyPlayer are GLOBAL
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

// move function is only called if a possibleMove has been selected
function move() {
  // if nothing is selectedPiece then do nothing
  // we just want to exit the function if this statement is true
  if (!$source) {return;}
  var $target = $(this);

  // tests for whether jump is possible
  var jumpTest = $target.hasClass('possibleJump');
  if (jumpTest) {
    // removes the jumped enemy piece
    var $jumpedPiece =  $('.jumpedPiece');
    $jumpedPiece.removeClass();
    $jumpedPiece.addClass('empty valid');

    // moves the player piece
    movePiece($source, $target);
    $source = $target;

    $('td').removeClass('possibleJump possibleMove');

    // test win condition
    winCondition();

    // test if can be made King
    isKing($source.data('y'));

    var areMoves = evaluateMoves();
    var bangJumpEast = !(areMoves.enemyJumpEast);
    var bangJumpWest = !(areMoves.enemyJumpWest);

    if (bangJumpEast && bangJumpWest) {
      $('td').removeClass('selectedPiece possibleJump possibleMove');
      switchUser();
    }
  // else if not a jump but a move
  } else {
    movePiece($source, $target);
    $source = $target;

    // test if can be made King
    isKing($source.data('y'));

    // remove selectedPiece forcing user to choose their next move using select function
    $('td').removeClass('selectedPiece possibleJump possibleMove');
    switchUser();
  }
}

function isKing(y) {
  if (currentPlayer === 'black_piece' && y === 0) {
    $source.addClass('black_king isKing');
  } else if (currentPlayer === 'red_piece' && y === 7) {
    $source.addClass('red_king isKing');
  }
}

function winCondition(){
  var remainingPieces = $('.'+enemyPlayer).length;
  if (remainingPieces === 0) {

    var WINSTR = (currentPlayer + ' WINS!!');
    alert(WINSTR);
  }
}
