import {
  AnyFunction,
} from '../../types';

export interface IOnRefreshEvent {
  fromAreaId?: string
  toAreaId?: string
  additionalInfo?: string | null
  moveText?: string
  fen?: string
  customEventName: "onRefresh"
  returnValue?: boolean
}

export interface IOptions {
  moveOutputField: string
  submitButton: string
  autoSubmit: boolean
  colorScheme: string
  pieceStyle: string
  real3D: boolean
  boardCoords: boolean
  boardCoordsPosition: string
  boardFlip: boolean
  viewOnly: boolean
  enabled: boolean
  boardSize: string
  chessBoardBorder: boolean
  markLastMove: boolean
  markLastMoveFrom: string
  markLastMoveTo: string
  markCurrentMoveFrom: string
  markCurrentMoveTo: string
  initialSetup: string
  highlightLegalMoves: boolean
  legalPositionCheck: string
  moveAnimation: boolean
  moveAnimationSpeed: string
  sounds: boolean
  soundTheme: string
  captureKeyStrokes: boolean
  moveListControl: string
  moveListScrollableElement: string
  backwardButtonBegin: string
  forwardButton1: string
  playPauseButton: string
  backwardButton1: string
  moveListVerticalStyle: boolean
  rightClickMarkSquare: boolean
  rightClickDragPoints: boolean
  diagramStyle: boolean
  shareMenuButton: string
  shareMenuContainer: string
  capturedPiecesControl: string
  shareMenuForcePgnDialog: string
  analyzeMove: boolean
}

export interface IGameSetup {
  pieces: Record<string, {
    color: number,
    type: string,
    area: string,
  }>,
  areas: Record<string, {
    pieces: string[],
  }>,
  flags: {
    sm: number, // side to move
    cs: string, // castling
    ep: string, // en passant
  },
  movecount: number,
  fiftyMoveCount: number,
  idSequencer: number,
  tbType: any[],
  tbFrom: any[],
  tbCaptured: any[],
  tbEnpassant: any[],
  tbIsCastling: any[],
  tbCastling: any[],
  promotedPieces: {},
  hands: { 1: string, 2: string },
}

export interface IAnimationIndex {
  standard: number,
  normal: number,
  live: number,
  bullet: number,
  blitz: number,
}

export interface ICustomEventsStack {
  context?: HTMLElement,
  stack: Array<{ context?: HTMLElement, callback: AnyFunction }>,
}

export interface IAnimation {
  _target: Element
  _options: { duration: number, easing: string, isBlocking: boolean }
  _keyframes: any
  _animProperties: any
  _startTime: number
  _endTime: number
  _stopped: boolean
  _ended: boolean
  _onStart: AnyFunction,
  _onUpdate: AnyFunction,
  _onStop: any
  _onEnd: AnyFunction,
  _onElapsedPercentageStack: any,
  easing: AnyFunction,
  isHTMLElement: boolean,
  _extraData: any,
}

export interface IChessBoardDOM {
  _board: IChessBoard,
  rootName: string,
  boardRows: number[],
  boardCols: string[],
  flippedBoardRows: number[],
  flippedBoardCols: string[],
  _pieces: any[],
  _markElements: Element[],
  _pieceElements: Element[],
  _piecesToDelete: {},
  options: {
    pieceTypes: string[],
    legalMoveHintSquareColor: string,
    legalMoveHintFieldFillRatio: number,
    avoidRegisteringMouseEvents: boolean,
  },
  _pieceStyleUrl: string,
  _pieceStyleImageFormat: string,
  _pieceStyleImagePath: string,
  _promotionPieceStyleUrl: string,
  _promotionPieceStyleImageFormat: string,
  gfxUrl: string,
  arrowsPath: string,
  piecesPath: string,
  backgroundsPath: string,
  _bordersWidth: number,
  _cacheSize: any,
  _currentSize: number,
  _overrideSize: any,
  _resizingTimeoutId: number,
  _preloadData: {
    size: number,
    pieceStyle: string,
    colorScheme: string,
  },
  _preloadImgList: Array<{ src: string, img: any, loaded: boolean }>,
  _preloadingImgList: []
  defaultMoveAnimation: { easing: string, onUpdate: AnyFunction}
  _moveAnimation: IAnimation,
  boardAreaElement: Element,
  coordsNumberElements: Element[],
  coordsLetterElements: Element[],
  promotionAreaElement: Element,
  promotionAreaContentElement: Element,
  promotionAreaCloseButtonElement: Element,
  promotionPieceElements: { q: Element, n: Element, r: Element, b: Element },
  draggingPiece: any,
  hoverSquareElement: Element,
}

export interface IMove {
  id: string
  fen: string
  moveText: string
  moveTextTranslated: string
  comment: string
  HTMLComment: string
  moveClass: any
  alternates: any[]
  fromAreaId: string
  toAreaId: string
  additionalInfo: any
  timestamp: number
  timeDelta: number
  animationInfo?: any
  showNumber?: any
  result?: any
}

export interface IGameRulesPrototype {
  makeMoves: AnyFunction
  clearArea: AnyFunction
  defineAreas: AnyFunction
  getFen: AnyFunction
  useFen: AnyFunction
  createBoardArray: AnyFunction
  isLegalPosition: AnyFunction
  isLegalMove: AnyFunction
  getDefaultPieceSetup: AnyFunction
  takeBackMove: AnyFunction
  makeMove: AnyFunction
  getAttackers: AnyFunction
  isAttacked: AnyFunction
  getKingArea: AnyFunction
  getCheckingPieces: AnyFunction
  isCheck: AnyFunction
  isMate: AnyFunction
  hasLegalMoves: AnyFunction
  getLegalMoves: AnyFunction
  setPositionEditor: AnyFunction
}

export interface IGameRules extends IGameRulesPrototype {
  _legalPositionCheck: string
  _legalMoveCheck: string
  promotion_what: string
  promotion_where: string
  promotion_gamesetup: any
  positionEditor: boolean
}

export interface IPgnParser {
  re_tag: RegExp
  re_move: RegExp
  re_comment: RegExp
  re_comment2: RegExp
  re_scoreExtractor: RegExp
  re_commandExtractor: RegExp
  re_clk: RegExp
  re_result: RegExp
  re_glyph: RegExp
  re_symbolicGlyph: RegExp
  re_token: RegExp
  TAGS_STATE: number
  MOVES_STATE: number
  moveNodes: any
  currentNode: number
  currentComment: any
  currentScore: any
  rootNodes: any[]
  state: number
  options: any
  _lastErrorMessage: any
  moveListControl: IMoveListControl
  curMoveList: IMoveListControl
  inFirstNode: boolean
  prevFen: any
  gameRules: IGameRules
  gameSetup: IGameSetup
}

export interface IMoveListControl {
  rootName: string,
  _rootElement: Element
  _visible: boolean
  _enabled: boolean
  _eventsRegistered: boolean
  _forwardButton1: string
  _forwardButton10: any
  _forwardButtonEnd: any
  _backwardButton1: string
  _backwardButton10: any
  _backwardButtonBegin: string
  _backwardButtonBeginElement: any
  _currentStateButton: any
  _resetStateButton: any
  _playPauseButton: string,
  _playPauseButtonElement: any
  _curentPlayButtonElement: any
  _playBackwardButtonSwap: boolean
  _scrollableElement: Element
  _stripCommentsInMoveList: boolean
  _HTMLCommentsVisible: boolean
  _timestampsVisible: boolean
  _timestampMaxValue: number
  _timestampMaxLength: number
  playingMoves: boolean
  playButtonText: string,
  playingMovesRealtime: boolean
  playingIntervalTime: any
  playingDirection: any
  playingAnimationSpeed: any
  playIntervalId: any
  playTimeoutId: any
  _moveListItemClass: string
  _moveListItemPrefix: string
  _moveListStylePrefix: string
  _commentBox: any
  _scoreBox: any
  _aLinesBox: any
  _verticalStyle: boolean
  _forceScrollIntoView: boolean
  _moveListDisplayType: string,
  _moveNodes: IMove[]
  _lastMoveInformation: any[]
  _tempMoveList: IMove[]
  pgnParser: IPgnParser
  _currentAlternateLine: IMoveListControl
  id: string,
  _firstMoveNumber: number
  startsWithBlack: boolean
  _parentLine: any
  _selectedNode: number
  _highlightedNode: any
  _currentStateNode: number
  _lastBlackElementId: string,
  _onMoveClickedCallback: AnyFunction
  _moveAnimation: boolean
  _diagramStyle: boolean
  _withinDiagram: boolean
  moveListEvents: {chessboard: Element}
  _verticalElement: Element
  _horizontalElement: Element
  _tempCurrentStateNode: number
}

export interface ICapturedPiecesControl {
  _whiteScoreDivId: string
  _blackScoreDivId: string
  playerScoreElements: Element[]
  lastElementsHtml: string[]
}

export interface IShareMenuControl {
  rootName: string
  rootElement: Element
  shareButton: Element
  container: Element
  _chessBoard: IChessBoard
  _setup: any
  _diagramId: any
  _shareMenuLabels: {
    download: string
    downloadInfo: string
    currentImage: string
    animatedImage: string
    animatedImageReady: string
    animatedImageFailure: string
    embed: string
    timestamps: string
  }
  _forcePgnDialog: boolean
  _pgnData: string
  _pgnDownloadType: string
  _pgnDownloadId: any
  _pgnDownloadExtra: any
  _pgnShowTimestamps: boolean
  _pgnHasTimestamps: boolean
  _moveListControl: IMoveListControl
  _globalDialogDivId: string
  _globalDialogContentDivId: string
  _globalDialogCloseButtonDivId: string
  _globalDialogFooterBarDivId: string
  _globalDialogTabsId: string
  _globalDialogShareButtonId: string
  _globalDialogDownloadButtonId: string
  _facebookButtonId: string
  _twitterButtonId: string
  _redditButtonId: string
  _shareExtraId: string
  _shareExtraButtonId: string
  _googlePlusButtonId: string
  _linkedinButtonId: string
  _tumblrButtonId: string
  _stumbleuponButtonId: string
  _mailButtonId: string
  _pgnTimestampsTogglerId: string
  _pgnContentTextareaId: string
  _favoritesButtonId: string
  _pgnFenButtonId: string
  _pgnDownloadButtonId: string
  _embedButtonId: string
  _shareUrlInputId: string
  _shareFenInputId: string
  _shareAnimatedGifId: string
  _shareText: string
  _customShareUrl: boolean
  _activeTab: any
  _fen: string
  _fenPgn: string
  _pgnTags: any
  _animatedGifUrl: any
  _shareUrl: string
}

export interface IChessBoardPrototype {
  initializeRenderer: AnyFunction
  registerCustomEvent: AnyFunction
  attachEvent: AnyFunction
  detachEvent: AnyFunction
  fireEvent: AnyFunction
  fireQueuedEvents: AnyFunction
  disableEvents: AnyFunction
  enableEvents: AnyFunction
  build: AnyFunction
  storeStyle: AnyFunction
  updateFromMove: AnyFunction
  refresh: AnyFunction
  setPieceStyle: AnyFunction
  setColorScheme: AnyFunction
  setBoardCoords: AnyFunction
  setOutsideCoords: AnyFunction
  setBoardSize: AnyFunction
  getBoardSize: AnyFunction
  getMarkingColor: AnyFunction
  doDynamicResize: AnyFunction
  doPartialResize: AnyFunction
  setBoardFlip: AnyFunction
  setPromotionPieces: AnyFunction
  showPromotionWindow: AnyFunction
  hidePromotionWindow: AnyFunction
  selectPromotionPiece: AnyFunction
  markArea: AnyFunction
  unmarkArea: AnyFunction
  _markInProgressMove: AnyFunction
  unmarkInProgressMove: AnyFunction
  blinkSquare: AnyFunction
  markArrow: AnyFunction
  setSquareColor: AnyFunction
  unmarkArrow: AnyFunction
  clearMarkedArrows: AnyFunction
  hasMarkings: AnyFunction
  setEnabled: AnyFunction
  canAnimateMove: AnyFunction
  animateMove: AnyFunction
  afterMoveAnimated: AnyFunction
  cancelAnimatingMoves: AnyFunction
  cancelDragging: AnyFunction
  setViewOnly: AnyFunction
  hidePieces: AnyFunction
  showPieces: AnyFunction
  calculateBoardOffset: AnyFunction
  calculateBoardSize: AnyFunction
  setAnimationType: AnyFunction
}

export interface IChessBoard extends IChessBoardPrototype {
  _player?: number
  rootName: string
  rootElement: HTMLElement,
  boardAreaNode: HTMLElement
  opts: IOptions,
  gameSetup: IGameSetup,
  _enabled: boolean
  _markedSquares: { size: number }
  _rightClickMarkedSquares: { size: number }
  _blinkSettings: {}
  _markedArrows: any[]
  _partiallyResized: boolean
  defaultSize: number
  dynamicSizeRange: [number, number]
  size: number
  _viewOnly: boolean
  preloadArrowImages: boolean
  preloadPiecesImages: boolean
  boardBorder: boolean
  roundedCorners: boolean
  colorScheme: string
  backgroundOverlay: boolean
  backgroundOverlayRule: string
  pieceStyle: string
  soundTheme: string
  boardFlip: boolean
  boardCoords: boolean
  boardCoordsPosition: string
  board3d: boolean
  promotionPieces: string
  markSourceSquare: boolean
  showHoverSquare: boolean
  hoverSquareColor: string
  hoverSquareAlpha: number
  rightClickMarkSquare: boolean
  rightClickDragPoints: boolean
  rightClickMarkColors: string[]
  highlightLegalMoves: boolean
  highlightLegalMovesColor: string
  _dragInProgress: boolean
  _markingInProgress: boolean
  _markingObj: any
  promotionWindowActive: boolean
  promotionWindowInfo: {}
  offsetx: number
  offsety: number
  _animationIndexes: {
    default: IAnimationIndex,
    slow: IAnimationIndex,
    battle: number,
  }
  _animationType: string
  _animationSpeedType: string
  _animationSpeed: number
  _lastAnimationTime: number
  _animating: boolean
  _piecesHidden: boolean
  _customEventStacks: Record<string, ICustomEventsStack>
  _customEventQueue: []
  _customEventActive: boolean
  _render: IChessBoardDOM
  autoSize: number
  built: boolean
  chessboardEvents: {chessboard: Element}
  _moveOutputField: Element
  _cancelButton: any
  _submitButton: any
  _moveInputField: any
  _autoSubmit: boolean
  _pgnBodyElement: any
  _doSounds: boolean
  _liveChessBoard: boolean
  _firstInitBoard: boolean
  _flipBoardButton: any
  _topInfoDiv2: any
  _bottomInfoDiv: any
  _initialSetup: ""
  _moveString: ""
  _variant: { code: "chess", name: "Chess", Rules: AnyFunction }
  _variantControl: { _board: IChessBoard, _variant: {code: "chess", name: "Chess", Rules: AnyFunction }, _controller: any}
  _sideControls: any
  _analyzeMode: boolean
  _markSquareColor: string
  _markLastMove: boolean
  _cancelPieceId: any
  _cancelAreaId: any
  _cancelAdditionalInfo: any
  _clickedPieceElement: any
  _moveMade: boolean
  _moveEncoder: {
    encodeMap: Record<string, string>
    _decodeMap: Record<string, string>
    _promoLeftQ: string
    _promoStraightQ: string
    _promoRightQ: string
    _promoLeftN: string
    _promoStraightN: string
    _promoRightN: string
    _promoLeftR: string
    _promoStraightR: string
    _promoRightR: string
    _promoLeftB: string
    _promoStraightB: string
    _promoRightB: string
  }
  _moveListControl: string
  _capturedPiecesControl: string
  _avoidCapturedPiecesControlOnNextRefresh: boolean
  _overrideSetEnabled: {overrideNextMode: boolean, overrideValue: boolean}
  _captureKeyStrokes: boolean
  getBoardApi: AnyFunction
  updateCapturedPiecesControl: AnyFunction
  _shareMenuButton: string
  _shareMenuContainer: string
  _shareMenuForcePgnDialog: string
  moveListControl: IMoveListControl
  capturedPiecesControl: ICapturedPiecesControl
  shareMenuControl: IShareMenuControl
  gameRules: IGameRules
  gfxUrl: string
  _previousMoveHints: any[]
  pgnTags: {
    Site: string
    Date: string
    Event: string
    Round: string
    FEN: string
    White: string
    Black: string
    Result: string
  }
  resultClocks: any
}

export interface TElementWithChessboard extends Element {
  chessBoard: IChessBoard
}
