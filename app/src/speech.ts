import {
  IMoveDetails,
} from './types';
import { i18n, getLocale } from './i18n';

const piecesMapping: Record<string, string> = {
  k: i18n('speechPieceKing'),
  q: i18n('speechPieceQueen'),
  r: i18n('speechPieceRook'),
  b: i18n('speechPieceBishop'),
  n: i18n('speechPieceKnight'),
  p: i18n('speechPiecePawn'),
};

const fileMapping: Record<string, string> = {
  a: i18n('speechFileA'),
  b: i18n('speechFileB'),
  c: i18n('speechFileC'),
  d: i18n('speechFileD'),
  e: i18n('speechFileE'),
  f: i18n('speechFileF'),
  g: i18n('speechFileG'),
  h: i18n('speechFileH'),
};

export function speak(text: string) : void {
  var speech = new SpeechSynthesisUtterance(text);
  speech.lang = getLocale();
  window.speechSynthesis.speak(speech);
}

export function announceMove(move: IMoveDetails) {
  const [fromFile, fromRank] = move.from.split('');
  const [toFile, toRank] = move.to.split('');

  const moveArgs: Record<string, string> = {
    piece: piecesMapping[move.piece],
    from: `${fileMapping[fromFile]} ${fromRank}`,
    to: `${fileMapping[toFile]} ${toRank}`,
  };

  if (move.promotionPiece) {
    moveArgs.promotion = piecesMapping[move.promotionPiece];
  }

  let moveText;

  if (move.promotionPiece) {
    moveText = i18n('speechPromotion', moveArgs);
  } else if (move.moveType === 'move') {
    if (move.piece === 'p') {
      moveText = i18n('speechPawnMoveMade', moveArgs);
    } else {
      moveText = i18n('speechPieceMoveMade', moveArgs);
    }
  } else if (move.moveType === 'capture') {
    if (move.piece === 'p') {
      moveText = i18n('speechPawnCaptureMade', moveArgs);
    } else {
      moveText = i18n('speechPieceCaptureMade', moveArgs);
    }
  } else if (move.moveType === 'short-castling') {
    moveText = i18n('speechShortCastling', moveArgs);
  } else if (move.moveType === 'long-castling') {
    moveText = i18n('speechLongCastling', moveArgs);
  }

  if (moveText) {
    if (move.checkmate) {
      moveText = i18n('speechCheckmate', { move: moveText });
    } else if (move.check) {
      moveText = i18n('speechCheck', { move: moveText });
    }

    speak(moveText);
  }
}
