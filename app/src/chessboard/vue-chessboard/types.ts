import {
  AnyFunction,
} from '../../types';

export interface IMarkings {
  arrows: any[]
  blinkingSquares: any[]
  effects: any[]
  squares: any[]
}

export interface IGameTree {
  initialMarkings: IMarkings
  selected: any
  lines: any[]
  selectedNode: any
  history: any[]
  markings: IMarkings
  premoves: any[]
  startingMoveNumber: number
}

export interface IMove {
  color: number
  to: string
  flags: number
  from: string
  piece: string
  san: string
}

export interface IPiece {
  type: string
  color: number
  promoted: false
  rank: number
  file: number
  id: string
  key: string
}

export interface INode {
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
  previous: any
  flags: number
  to: string
  from: string
  drop: any
  capturedStr: string
  promotion: any
  piece: string
  ids: any
  time: number
}

export interface IGameSetup {
  ranks: number
  files: number
  playingAs: number
  gameOver: boolean
  check: boolean
  checkmate: boolean
  draw: boolean
  stalemate: boolean
  threefold: boolean
  insufficient: boolean
  legalMoves: IMove[]
  fiftyMoveRule: boolean
  legalPremoves: IMove[]
  fen: string
  pieces: IPiece[]
  sideToMove: number
  castling: string
  epSquare: any
  halfMoves: number
  moveNumber: number
  move: any
  hand: any
  checks: any
  capturedPieces: any[]
  capturedScores: any[]
  result: string
}

export interface IGameSettings {
  variations: boolean
  analysis: boolean
  mainLineIsImmutable: boolean
  rules: boolean
  premoves: boolean
  GTM: boolean
}

export interface IGameOptions {
  allowMarkings: boolean
  animationType: string
  autoPromote: boolean
  boardStyle: string
  captureKeyStrokes: boolean
  coordinates: any
  darkMode: boolean
  diagramStyle: boolean
  enabled: boolean
  highlightColor: string
  highlightLegalMoves: boolean
  highlightMoves: boolean
  highlightOpacity: number
  isWhiteOnBottom: boolean
  legalPositionCheck: string
  moveMethod: string
  overlayInAnalysisMode: boolean
  pieceStyle: string
  playSounds: boolean
  premoveHighlightColor: string
  premoveHighlightOpacity: number
  real3D: boolean
  rounded: boolean
  soundTheme: string
  boardSize: string
  moveListDisplayType: string
  flipBoard: boolean
  fadeSetup: number
}

export interface IPositionChanged {
  fen: string
  isPremove: number
  check: boolean
  checkmate: boolean
  sideToMove: number
  playingAs: number
}

export interface IGame {
  id: string
  variant: string
  settings: IGameSettings
  setup: IGameSetup
  tree: IGameTree
  history: Array<{ type: string, payload: any }>
  markings: IMarkings
  premoves: any[]
  startingMoveNumber: number
}

export interface IEventMove {
  from: string | {}
  to: string | {}
  isIllegal: boolean
  promotion: string | null
}

export type TEvent =
  'chessboard-busyFlag' |
  'chessboard-makeMove' |
  'chessboard-markSquare' |
  'chessboard-clearSquare' |
  'chessboard-clearBlinkingSquare' |
  'chessboard-markArrow' |
  'chessboard-clearArrow' |
  'chessboard-clearMarkings' |
  'chessboard-moveBackward' |
  'chessboard-moveForward' |
  'chessboard-moveToEnd' |
  'chessboard-moveToStart' |
  'chessboard-cancelPremoves' |
  'chessboard-cancelGuessTheMove' |
  'chessboard-moveInfo' |
  'chessboard-boardInitialized';

export type TChessboardEvent =
  'LOADED' |
  'PIECE_SELECTED' |
  'MOVE_MADE' |
  'ADD_LEGAL_MOVES' |
  'ADD_PIECES' |
  'ADD_SQUARES' |
  'BLINK_SQUARE' |
  'CLOSE_PROMOTION_MENU' |
  'DRAG_PIECE' |
  'DROP_PIECE' |
  'FADE_PIECES' |
  'FLIP_BOARD' |
  'MOVE_PIECES' |
  'OPEN_PROMOTION_MENU' |
  'PICK_UP_PIECE' |
  'REMOVE_LEGAL_MOVES' |
  'REMOVE_SQUARES' |
  'REMOVE_PIECES' |
  'SET_PIECE' |
  'SET_PIECES' |
  'SET_SQUARES' |
  'SHOW_HOVER_SQUARE' |
  'HIDE_HOVER_SQUARE' |
  'UPDATE_BOARD_CLASSES' |
  'UPDATE_BOARD_IMAGE' |
  'UPDATE_BOARD_SIZE' |
  'UPDATE_PIECE_IMAGES' |
  'UPDATE_PROMOTION_MENU_SIZE' |
  'CLICKED' |
  'ARROW_CLEARED' |
  'ARROW_MARKED' |
  'BOARD_DIMENSIONS_SET' |
  'BUSY_FLAG' |
  'CANCEL_PREMOVES' |
  'CANCEL_GTM' |
  'EFFECT_CLEARED' |
  'EFFECT_MARKED' |
  'MARKINGS_CLEARED' |
  'SET_ARROWS' |
  'SET_EFFECTS' |
  'SET_CUSTOM_ITEMS' |
  'SQUARE_CLEARED' |
  'SQUARE_MARKED' |
  'MOVE_BACKWARD' |
  'MOVE_FORWARD' |
  'MOVE_TO_END' |
  'MOVE_TO_START' |
  'KEY_PRESS' |
  'OPTIONS_CHANGED' |
  'PLAY_SOUND';

export interface IVueChessboardStore {
  actionsQueue: any[]
  moveList: { lines: any[] }
  squareSize: number
  initialized: boolean
  effects: any[]
  customItems: any[]
  arrows: any[]
  boardId: string
  extensions: Record<string, any>
  game: IGame
  options: IGameOptions
  resizeModifier: { x: number, y: number }
  handleWindowResize: boolean
  historyLength: number
  positionChanged: IPositionChanged
  legalMovesChanged: {
    legalMoves: IMove[]
    legalPremoves: IMove[]
  }
  coordColors: {
    white: string
    black: string
  }
  createChessboard: AnyFunction
  dispatch: AnyFunction
  getDomFormatters: AnyFunction
  getBoardParentBoundingRect: AnyFunction
  onKeydown: AnyFunction
  resizeBoard: AnyFunction
  _data: {
    arrows: any[]
    customItems: any[]
    effects: any[]
    initialized: boolean
    squareSize: number
    moveList: {
      lines: any[]
    }
    actionsQueue: any[]
  }
  _events: Record<TEvent, Array<(move: IEventMove) => void>>
  _computedWatchers: any
  $el: HTMLElement
  chessboard: {
    dispatch: AnyFunction
    emit: AnyFunction
    extensions: Record<string, any>
    off: AnyFunction
    on: (event: TChessboardEvent, fn: AnyFunction) => void
    state: {
      arrows: any[]
      squares: any[]
      customItems: any[]
      board: {
        files: number
        ranks: number
        size: number
        squareSize: number
        boardBg: string
        pieceBaseBg: string
        highlightColor: any
      }
      busy: boolean
      busyFlagTimeout: any
      draggingPiece: any
      drawingArrow: boolean
      drawingArrowFrom: any
      movedPiece: any
      gameSettings: IGameSettings
      legalMoves: IMove[]
      isCheck: boolean
      isCheckmate: boolean
      markedSquareColors: {
        alt: string
        default: string
        shift: string
        ctrl: string
      }
      markedSquareOpacity: number
      options: IGameOptions
      pieces: IPiece[]
      previousPieces: IPiece[]
      premoves: any[]
      preselectedPiece: any
      promotion: { from: any, piece: any, to: any }
      selectedNode?: INode
      selectedPiece: any
      analysisMode: boolean
      sideToMove?: number
      playingAs?: number
      preventNextSelect: boolean
      effects: any[]
    }
    subscriptions: Record<string, { type: string, handler: AnyFunction }>
  }
}

export interface TElementWithVueChessboard extends Element {
  __vue__: IVueChessboardStore
}
