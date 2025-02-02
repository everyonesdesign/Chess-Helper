// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Move", "symbols": ["UciMove"], "postprocess": (data) =>  ({ type: "uci", uciData:  data[0] })},
    {"name": "Move", "symbols": ["AlgebraicMove"], "postprocess": (data) =>  ({ type: "algebraic", algebraicData:  data[0] })},
    {"name": "Move", "symbols": ["CastlingMove"], "postprocess": (data) =>  ({ type: "castling", castlingData: data[0] })},
    {"name": "UciMove", "symbols": ["UciCoord", "UciCoord", "UciPromotion"], "postprocess": (data) =>  ({ piece: '.', from: data[0], to: data[1], promotion: data[2] })},
    {"name": "UciCoord", "symbols": ["File", "Rank"], "postprocess": (data) => data[0] + data[1]},
    {"name": "UciPromotion", "symbols": ["NotKingPiece"], "postprocess": (d) => d[0]},
    {"name": "UciPromotion", "symbols": [], "postprocess": () => undefined},
    {"name": "AlgebraicMove", "symbols": ["PieceMove"], "postprocess": (data) =>  ({ type: "piece", pieceData: data[0] })},
    {"name": "AlgebraicMove", "symbols": ["PawnMove"], "postprocess": (data) =>  ({ type: "pawn", pawnData: data[0] })},
    {"name": "PawnMove", "symbols": ["MaybeFile", "Capture", "File", "Rank", "Promotion"], "postprocess":  (data) =>  {
          const result = { piece: "p", from: data[0] + '.', to: data[2] + data[3] };
          if (data[4]) {
            data.promotion = data[4]
          }
          return result;
        } },
    {"name": "PieceMove", "symbols": ["Piece", "MaybeFile", "MaybeRank", "Capture", "File", "Rank"], "postprocess":  (data) =>  ({
          piece: data[0],
          from: data[1] + data[2],
          to: data[4] + data[5],
        }) },
    {"name": "CastlingMove", "symbols": ["ShortCastling"], "postprocess": (data) => ({ kind: 'short' })},
    {"name": "CastlingMove", "symbols": ["LongCastling"], "postprocess": (data) => ({ kind: 'long' })},
    {"name": "LongCastling", "symbols": ["CastlingChar", "CastlingSeparator", "CastlingChar", "CastlingSeparator", "CastlingChar"]},
    {"name": "ShortCastling", "symbols": ["CastlingChar", "CastlingSeparator", "CastlingChar"]},
    {"name": "CastlingSeparator", "symbols": [{"literal":"-"}]},
    {"name": "CastlingSeparator", "symbols": []},
    {"name": "CastlingChar", "symbols": [{"literal":"o"}]},
    {"name": "CastlingChar", "symbols": [{"literal":"O"}]},
    {"name": "CastlingChar", "symbols": [{"literal":"0"}]},
    {"name": "Capture", "symbols": [{"literal":"x"}]},
    {"name": "Capture", "symbols": []},
    {"name": "EnPassant", "symbols": [{"literal":"e"}, "EnPassantDot", {"literal":"p"}, "EnPassantDot"]},
    {"name": "EnPassantDot", "symbols": [{"literal":"."}]},
    {"name": "EnPassantDot", "symbols": []},
    {"name": "Promotion", "symbols": [{"literal":"="}, "NotKingPiece"], "postprocess": (data) => data[1]},
    {"name": "Promotion", "symbols": [], "postprocess": () => undefined},
    {"name": "Piece", "symbols": ["NotKingPiece"], "postprocess": (d) => d[0]},
    {"name": "Piece", "symbols": ["KingPiece"], "postprocess": (d) => d[0]},
    {"name": "NotKingPiece", "symbols": [{"literal":"r"}], "postprocess": () => "r"},
    {"name": "NotKingPiece", "symbols": [{"literal":"n"}], "postprocess": () => "n"},
    {"name": "NotKingPiece", "symbols": [{"literal":"b"}], "postprocess": () => "b"},
    {"name": "NotKingPiece", "symbols": [{"literal":"q"}], "postprocess": () => "q"},
    {"name": "NotKingPiece", "symbols": [{"literal":"R"}], "postprocess": () => "r"},
    {"name": "NotKingPiece", "symbols": [{"literal":"N"}], "postprocess": () => "n"},
    {"name": "NotKingPiece", "symbols": [{"literal":"B"}], "postprocess": () => "b"},
    {"name": "NotKingPiece", "symbols": [{"literal":"Q"}], "postprocess": () => "q"},
    {"name": "KingPiece", "symbols": [{"literal":"K"}], "postprocess": () => "k"},
    {"name": "KingPiece", "symbols": [{"literal":"k"}], "postprocess": () => "k"},
    {"name": "File", "symbols": [{"literal":"a"}], "postprocess": () => "a"},
    {"name": "File", "symbols": [{"literal":"b"}], "postprocess": () => "b"},
    {"name": "File", "symbols": [{"literal":"c"}], "postprocess": () => "c"},
    {"name": "File", "symbols": [{"literal":"d"}], "postprocess": () => "d"},
    {"name": "File", "symbols": [{"literal":"e"}], "postprocess": () => "e"},
    {"name": "File", "symbols": [{"literal":"f"}], "postprocess": () => "f"},
    {"name": "File", "symbols": [{"literal":"g"}], "postprocess": () => "g"},
    {"name": "File", "symbols": [{"literal":"h"}], "postprocess": () => "h"},
    {"name": "File", "symbols": [{"literal":"A"}], "postprocess": () => "a"},
    {"name": "File", "symbols": [{"literal":"B"}], "postprocess": () => "b"},
    {"name": "File", "symbols": [{"literal":"C"}], "postprocess": () => "c"},
    {"name": "File", "symbols": [{"literal":"D"}], "postprocess": () => "d"},
    {"name": "File", "symbols": [{"literal":"E"}], "postprocess": () => "e"},
    {"name": "File", "symbols": [{"literal":"F"}], "postprocess": () => "f"},
    {"name": "File", "symbols": [{"literal":"G"}], "postprocess": () => "g"},
    {"name": "File", "symbols": [{"literal":"H"}], "postprocess": () => "h"},
    {"name": "MaybeFile", "symbols": ["File"], "postprocess": (d) => d[0]},
    {"name": "MaybeFile", "symbols": [], "postprocess": () =>  '.'},
    {"name": "Rank", "symbols": [{"literal":"1"}]},
    {"name": "Rank", "symbols": [{"literal":"2"}]},
    {"name": "Rank", "symbols": [{"literal":"3"}]},
    {"name": "Rank", "symbols": [{"literal":"4"}]},
    {"name": "Rank", "symbols": [{"literal":"5"}]},
    {"name": "Rank", "symbols": [{"literal":"6"}]},
    {"name": "Rank", "symbols": [{"literal":"7"}]},
    {"name": "Rank", "symbols": [{"literal":"8"}]},
    {"name": "MaybeRank", "symbols": ["Rank"], "postprocess": (d) => d[0]},
    {"name": "MaybeRank", "symbols": [], "postprocess": () =>  '.'}
]
  , ParserStart: "Move"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
