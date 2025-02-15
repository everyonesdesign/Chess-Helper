export type Nullable<T> = T | null;

export type AnyFunction = (...args: any[]) => any;

export interface IChessboardConstructor {
  new (element: Element): IChessboard;
}

export interface IChessboard {
  getElement: () => Element
  getRelativeContainer: () => Element
  makeMove: (fromSq: TArea, toSq: TArea, promotionPiece?: string) => void
  isLegalMove: (fromSq: TArea, toSq: TArea) => boolean
  isPlayersMove: () => boolean
  getPiecesSetup: () => Record<string, { color: number, type: string, area: TArea }>
  markArrow: (fromSq: TArea, toSq: TArea) => void
  unmarkArrow: (fromSq: TArea, toSq: TArea) => void
  clearMarkedArrows: () => void
  markArea: (square: TArea) => void
  unmarkArea: (square: TArea) => void
  clearMarkedAreas: () => void
  clearAllMarkings: () => void
  submitDailyMove: () => void
}

export type TArea = string;

export type TPiece = string;

export type TFromTo = [ TArea, TArea ];

export type TMoveType = string;

export interface IMoveTemplate {
  piece: TPiece
  from?: TArea
  to: TArea
  promotionPiece?: TPiece
}

export type IPotentialMoves = IMoveTemplate[];

export interface IMove extends IMoveTemplate {
  from: TArea
}

export interface IMoveDetails {
  piece: TPiece
  moveType: TMoveType
  from: TArea
  to: TArea
  promotionPiece?: TPiece
  check: boolean
  checkmate: boolean
}

export interface IConfig {
  defaultLocale: string,
}

export type TTranslationId =
  'ambiguousMove' |
  'incorrectMove' |
  'illegalMove' |
  'commandNotFound' |
  'inputHint' |
  'focusHint' |
  'focusHintFromOther' |
  'blindFoldPeekHint' |
  'blindFoldOn' |
  'blindfoldToggleHint' |
  '_test' |
  '_test_1_placeholder' |
  '_test_2_placeholders';

export type TLocaleSet = Record<TTranslationId, string>;

export interface Command {
  name: string;
  isAvailable: () => boolean;
  act: () => void;
}
