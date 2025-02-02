Move
 -> UciMove {% (data) =>  ({ type: "uci", uciData:  data[0] }) %}
  | AlgebraicMove {% (data) =>  ({ type: "algebraic", algebraicData:  data[0] }) %}
  | CastlingMove {% (data) =>  ({ type: "castling", castlingData: data[0] }) %}

UciMove -> UciCoord UciCoord UciPromotion {% (data) =>  ({ piece: '.', from: data[0], to: data[1], promotionPiece: data[2] }) %}
UciCoord -> File Rank {% (data) => data[0] + data[1] %}
UciPromotion
 -> NotKingPiece {% (d) => d[0] %}
  | null {% () => undefined %}

AlgebraicMove
 -> PieceMove CheckOrMate {% (data) =>  ({ type: "piece", pieceData: data[0] }) %}
  | PawnMove CheckOrMate {% (data) =>  ({ type: "pawn", pawnData: data[0] }) %}
PawnMove
 ->
    MaybeFile Capture File Rank EnPassant Promotion
    {% (data) =>  {
      const result = { piece: "p", from: data[0] + '.', to: data[2] + data[3] };
      if (data[5]) {
        result.promotionPiece = data[5]
      }
      return result;
    } %}
PieceMove -> Piece MaybeFile MaybeRank Capture File Rank
    {% (data) =>  ({
      piece: data[0],
      from: data[1] + data[2],
      to: data[4] + data[5],
    }) %}
CastlingMove
 -> ShortCastling {% (data) => ({ kind: 'short' }) %}
  | LongCastling {% (data) => ({ kind: 'long' }) %}
LongCastling -> CastlingChar CastlingSeparator CastlingChar CastlingSeparator CastlingChar
ShortCastling ->CastlingChar CastlingSeparator CastlingChar
CastlingSeparator -> "-" | null
CastlingChar -> "o" | "O" | "0"
Capture -> "x" | null
EnPassant -> "e" EnPassantDot "p" EnPassantDot | null
EnPassantDot -> "." | null
Promotion
 -> "=" NotKingPiece {% (data) => data[1] %}
  | null {% () => undefined %}
Piece
 -> NotKingPiece {% (d) => d[0] %}
  | KingPiece {% (d) => d[0] %}
NotKingPiece
 -> "r" {% () => "r" %}
  | "n" {% () => "n" %}
  | "b" {% () => "b" %}
  | "q" {% () => "q" %}
  | "R" {% () => "r" %}
  | "N" {% () => "n" %}
  | "B" {% () => "b" %}
  | "Q" {% () => "q" %}
CheckOrMate -> Check | Mate
Check -> "+" | null
Mate -> "#" | null

KingPiece
 -> "K" {% () => "k" %}
  | "k" {% () => "k" %}

File
 -> "a" {% () => "a" %}
  | "b" {% () => "b" %}
  | "c" {% () => "c" %}
  | "d" {% () => "d" %}
  | "e" {% () => "e" %}
  | "f" {% () => "f" %}
  | "g" {% () => "g" %}
  | "h" {% () => "h" %}
  | "A" {% () => "a" %}
  | "B" {% () => "b" %}
  | "C" {% () => "c" %}
  | "D" {% () => "d" %}
  | "E" {% () => "e" %}
  | "F" {% () => "f" %}
  | "G" {% () => "g" %}
  | "H" {% () => "h" %}
MaybeFile
 -> File {% (d) => d[0] %}
  | null {% () =>  '.' %}
Rank -> "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
MaybeRank
 -> Rank {% (d) => d[0] %}
  | null {% () =>  '.' %}
