import { CompiledRules } from 'nearley';
export type Move =
  | { type: 'uci'; uciData: UciMove }
  | { type: 'algebraic'; algebraicData: AlgebraicMove }
  | { type: 'castling'; castlingData: CastlingMove };
export type UciMove = { piece: '.', from: UciCoord; to: UciCoord };
export type UciCoord = string;
export type AlgebraicMove =
  | { type: 'piece'; pieceData: PieceMove }
  | { type: 'pawn'; pawnData: PawnMove };
export type PawnMove = {
  piece: 'p';
  from: string;
  to: string;
  promotion?: Promotion;
};
export type PieceMove = {
  piece: Piece | '.';
  from: string;
  to: string;
};
export type CastlingMove = { kind: 'short' } | { kind: 'long' };
export type CastlingChar = string;
export type Capture = 'x';
export type Promotion = NotKingPiece;
export type Piece = NotKingPiece | KingPiece;
export type NotKingPiece = 'r' | 'n' | 'b' | 'q';
export type KingPiece = 'k';
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Rank = string;

declare const grammar:CompiledRules;
export default grammar;
