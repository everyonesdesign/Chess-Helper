# Recognise chess moves
Move -> UCI | Algebraic

UCI -> UciCoord UciCoord
UciCoord -> File Rank

Algebraic -> AlgebraicMove | Castling
AlgebraicMove -> PieceMove | PawnMove
PawnMove -> MaybeFile Capture File Rank Promotion
PieceMove -> MaybePiece MaybeFile MaybeRank Capture File Rank
Castling -> ShortCastling | LongCastling
LongCastling -> CastlingChar CastlingSeparator CastlingChar CastlingSeparator CastlingChar
ShortCastling ->CastlingChar CastlingSeparator CastlingChar
CastlingSeparator -> "-" | null
CastlingChar -> "o" | "O" | "0"
Capture -> null | "x"
EnPassant -> "e" EnPassantDot "p" EnPassantDot
EnPassantDot -> null | "."
Promotion -> null | "=" PromotionPiece
Piece -> PromotionPiece | KingPiece
MaybePiece -> null | Piece
PromotionPiece -> "R" | "N" | "B" | "Q" | "r" | "n" | "b" | "q"
KingPiece -> "K" | "k"

File -> FileLowerCase | FileUpperCase
FileLowerCase -> "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"
FileUpperCase -> "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
MaybeFile -> null | File
Rank -> "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
MaybeRank -> null | Rank
