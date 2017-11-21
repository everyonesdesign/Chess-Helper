function init() {
  var container = document.querySelector('.chess-board-container');
  if (container) {
    var input = document.createElement('input');
    input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        go(input.value);
        input.value = '';
        input.focus();
      }
    });
    container.appendChild(input);
  }
}

function go(input) {
  try {
    makeMove(myEvent.capturingBoard, input.slice(0, 2), input.slice(2, 4));
  } catch(e) {
    alert('Move is illegal');
  }
}

function makeMove(board, fromField, toField) {
  if (board.gameRules.isLegalMove(board.gameSetup, fromField, toField)) {
      board.fireEvent('onDropPiece', {
          fromAreaId: fromField,
          targetAreaId: toField,
      });
  } else {
    throw new Error('Move is illegal');
  }
}

init();
