import {
  AnyFunction,
  TArea,
  TPiece,
} from '../../types';

export interface IHighlights {
  addModule: AnyFunction
  getModules: AnyFunction
  removeModule: AnyFunction
}

export interface IClocksItem {
  emit: AnyFunction
  off: AnyFunction
  offAll: AnyFunction
  offMany: AnyFunction
  on: AnyFunction
  onAll: AnyFunction
  onMany: AnyFunction
  subscriptions: {
    all: any[]
    End: any[]
  }
  add: AnyFunction
  destroy: AnyFunction
  get: AnyFunction
  reset: AnyFunction
  start: AnyFunction
  stop: AnyFunction
}

export interface IClocks {
  1: IClocksItem
  2: IClocksItem
  activate: AnyFunction
  deactivate: AnyFunction
  getTimeControl: AnyFunction
  getTimeControlType: AnyFunction
  isActive: AnyFunction
  setTimeControl: AnyFunction
}

export interface IPlugins {
  add: AnyFunction
  get: AnyFunction
  remove: AnyFunction
  setCreatePluginContext: AnyFunction
}

export type TAreaFromTo = string;

export type TMarkingArea = TArea | TAreaFromTo;

export type TMarkingType = 'arrow' | 'effect' | 'square';

export interface IMarking {
  key: TMarkingArea
  type: TMarkingType
  color?: string
  data?: any[]
}

// Seems to appear in later versions?
export interface IMarking2 {
  square?: { color: 'd', square: TArea },
  arrow?:  { color: 'd', from: TArea, to: TArea },
}

export interface IMove {
  from: TArea
  to: TArea
  color?: number
  flags?: number
  piece?: TPiece
  san?: string
  lines?: any
  animate?: boolean
  userGenerated?: boolean
  userGeneratedDrop?: boolean
  promotion?: string
}

export type TEventType =
  'Create' |
  'DeletePosition' |
  'LineUpdated' |
  'Load' |
  'ModeChanged' |
  'Move' |
  'MoveBackward' |
  'MoveForward' |
  'SelectLineEnd' |
  'SelectLineStart' |
  'SelectNode' |
  'TimeControlUpdated' |
  'Undo' |
  'UpdateOptions';

export interface IMoveEvent {
  data: {
    plyDiff: number
    lineDiff: number
    animate: boolean
    move: {
      move: number
      epSquare: number
      halfMoves: number
      castlingW: number
      castlingB: number
      color: number
      hash: number[]
      captured: number
      san: string
      fen: string
      beforeFen: string
      moveNumber: number
      previous: {
        move: number
        line: number
      }
      flags: number
      to: string
      from: string
      drop: any
      capturedStr?: string
      promotion?: string
      piece: string
      ids: {
        move: number
        line: number
      }
      lines: any
      animate: boolean
      EPCapturedSquare: any
      userGenerated: boolean
      userGeneratedDrop: boolean
    }
  }
  type: "Move"
}

export interface IMarkingsData {
  arrow: Record<TAreaFromTo, {
    type: "arrow"
    key: TAreaFromTo
    color: 'default' | string
    from: string
    to: string
    data: any
  }>
  customItem: any
  effect: any
  square: Record<TArea, {
    type: "square"
    key: TArea
    color: 'default' | string
    data: any
  }>
}

export interface IPiece {
  type: string
  color: number
  promoted: boolean
  square: TArea
}

export interface IPiecesManager {
  deleteItem: AnyFunction
  get: AnyFunction
  getCollection: () => Record<TArea, IPiece>
  isDefined: AnyFunction
  keys: AnyFunction
  set: AnyFunction
}

export interface IOptions {
  allowMarkings: boolean
  analysis: boolean
  analysisHighlightColors: {alt: string, ctrl: string, default: string, shift: string}
  analysisHighlightOpacity: number
  animationType: string
  arrowColors: {alt: string, ctrl: string, default: string, shift: string}
  aspectRatio: number
  autoClaimDraw: boolean
  autoPromote: boolean
  autoResize: boolean
  boardSize: string
  boardStyle: string
  captureKeyStrokes: boolean
  checkBlinkingSquareColor: string
  coordinates: string
  darkMode: boolean
  diagramStyle: boolean
  enabled: boolean
  fadeSetup: number
  fetched: boolean
  flipBoard: boolean
  flipped: boolean
  highlightColor: any
  highlightLegalMoves: boolean
  highlightMoves: boolean
  highlightMovesUI: boolean
  highlightOpacity: number
  hoverSquareOutline: boolean
  id: string
  isWhiteOnBottom: boolean
  legalPositionCheck: string
  mainLineIsImmutable: boolean
  maxWidth: number
  moveListContextMenuEnabled: boolean
  moveListDisplayType: string
  moveMethod: string
  overlayInAnalysisMode: boolean
  pieceStyle: string
  playSounds: boolean
  premoveDelay: number
  premoveHighlightColor: string
  premoveHighlightOpacity: number
  real3D: boolean
  rounded: boolean
  rules: boolean
  soundTheme: string
  threatSquareColor: string
  threatSquareOpacity: number
  variations: boolean
}

export interface IGame {
  agreeDraw: AnyFunction
  before: AnyFunction
  blinkSquare: AnyFunction
  cancelPremoves: AnyFunction
  claimDraw: AnyFunction
  clearMarkings: (types: TMarkingType[], someBoolean?: boolean) => any
  clocks: IClocks
  consumeNextPremove: AnyFunction
  createContinuation: AnyFunction
  deletePosition: AnyFunction
  destroy: AnyFunction
  emit: (event: TEventType, data: any) => void
  extendAPI: AnyFunction
  getCheatDetection: AnyFunction
  getContext: AnyFunction
  getFEN: AnyFunction
  getHeaders: AnyFunction
  getHistoryFENs: AnyFunction
  getHistorySANs: AnyFunction
  getLastMove: AnyFunction
  getLegalMoves: () => IMove[]
  getLegalMovesForSquare: (square: TArea) => IMove[]
  getLegalPremovesForSquare: AnyFunction
  getLine: AnyFunction
  getMarkings: () => IMarkingsData
  getMaterial: AnyFunction
  getMode: AnyFunction
  getMove: (move: Partial<IMove>) => IMove
  getNodeByIds: AnyFunction
  getNodeDiffData: AnyFunction
  getNodeIds: AnyFunction
  getOptions: () => IOptions,
  getPGN: AnyFunction
  getPiece: (square: TArea) => IPiece
  getPieces: () => IPiecesManager
  getPlayingAs?: () => number
  getPointerPosition: AnyFunction
  getPosition: AnyFunction
  getPositionDetails: AnyFunction
  getPremove: AnyFunction
  getPremovePieces: AnyFunction
  getPremoves: AnyFunction
  getRawLines: AnyFunction
  getRelativeNode: AnyFunction
  getResult: AnyFunction
  getSelectedNode: AnyFunction
  getStartingMoveNumber: AnyFunction
  getTCN: AnyFunction
  getTurn: () => number
  getVariant: AnyFunction
  highlights: IHighlights
  isAnimating: AnyFunction
  isAtEndOfLine: AnyFunction
  isCheck: AnyFunction
  isGameOver: AnyFunction
  isLegalMove: AnyFunction
  isLegalPremove: AnyFunction
  load: AnyFunction
  mark: AnyFunction
  move: (move: IMove) => void
  moveBackward: AnyFunction
  moveForward: AnyFunction
  moveVariation: AnyFunction
  off: AnyFunction
  offAll: AnyFunction
  on: (event: TEventType, fn: AnyFunction) => void
  onAll: AnyFunction
  outOfTime: AnyFunction
  playSound: AnyFunction
  plugins: IPlugins
  premove: AnyFunction
  promoteVariation: AnyFunction
  resetGame: AnyFunction
  resetToMainLine: AnyFunction
  resign: AnyFunction
  resize: AnyFunction
  run: AnyFunction
  selectLineEnd: AnyFunction
  selectLineStart: AnyFunction
  selectNode: AnyFunction
  setGameDetails: AnyFunction
  setMode: AnyFunction
  setOptions: AnyFunction
  setPlayingAs: (player: number) => number
  setTimestamps: AnyFunction
  setTurn: AnyFunction
  toggleMarking: (marking: IMarking | IMarking2, someBoolean?: boolean) => any
  undo: AnyFunction
  unmark: AnyFunction
  updateLineComment: AnyFunction
  updateNode: AnyFunction
  updateResultHeader: AnyFunction
}

export interface TElementWithGame extends Element {
  game: IGame
}
