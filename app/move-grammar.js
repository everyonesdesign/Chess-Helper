// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Move", "symbols": ["UCI"]},
    {"name": "Move", "symbols": ["Algebraic"]},
    {"name": "UCI", "symbols": ["UciCoord", "UciCoord"]},
    {"name": "UciCoord", "symbols": ["File", "Rank"]},
    {"name": "Algebraic", "symbols": ["AlgebraicMove"]},
    {"name": "Algebraic", "symbols": ["Castling"]},
    {"name": "AlgebraicMove", "symbols": ["PieceMove"]},
    {"name": "AlgebraicMove", "symbols": ["PawnMove"]},
    {"name": "PawnMove", "symbols": ["MaybeFile", "Capture", "File", "Rank", "Promotion"]},
    {"name": "PieceMove", "symbols": ["MaybePiece", "MaybeFile", "MaybeRank", "Capture", "File", "Rank"]},
    {"name": "Castling", "symbols": ["ShortCastling"]},
    {"name": "Castling", "symbols": ["LongCastling"]},
    {"name": "LongCastling", "symbols": ["CastlingChar", "CastlingSeparator", "CastlingChar", "CastlingSeparator", "CastlingChar"]},
    {"name": "ShortCastling", "symbols": ["CastlingChar", "CastlingSeparator", "CastlingChar"]},
    {"name": "CastlingSeparator", "symbols": [{"literal":"-"}]},
    {"name": "CastlingSeparator", "symbols": []},
    {"name": "CastlingChar", "symbols": [/[oO0]/]},
    {"name": "Capture", "symbols": []},
    {"name": "Capture", "symbols": [{"literal":"x"}]},
    {"name": "EnPassant", "symbols": [{"literal":"e"}, "EnPassantDot", {"literal":"p"}, "EnPassantDot"]},
    {"name": "EnPassantDot", "symbols": []},
    {"name": "EnPassantDot", "symbols": [{"literal":"."}]},
    {"name": "Promotion", "symbols": []},
    {"name": "Promotion", "symbols": [{"literal":"="}, "PromotionPiece"]},
    {"name": "Piece", "symbols": ["PromotionPiece"]},
    {"name": "Piece", "symbols": ["KingPiece"]},
    {"name": "MaybePiece", "symbols": []},
    {"name": "MaybePiece", "symbols": ["Piece"]},
    {"name": "PromotionPiece", "symbols": [{"literal":"R"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"N"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"B"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"Q"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"r"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"n"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"b"}]},
    {"name": "PromotionPiece", "symbols": [{"literal":"q"}]},
    {"name": "KingPiece", "symbols": [{"literal":"K"}]},
    {"name": "KingPiece", "symbols": [{"literal":"k"}]},
    {"name": "File", "symbols": [/[a-h]/]},
    {"name": "File", "symbols": [/[A-H]/]},
    {"name": "MaybeFile", "symbols": []},
    {"name": "MaybeFile", "symbols": ["File"]},
    {"name": "Rank", "symbols": [/[1-8]/]},
    {"name": "MaybeRank", "symbols": []},
    {"name": "MaybeRank", "symbols": ["Rank"]}
]
  , ParserStart: "Move"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
