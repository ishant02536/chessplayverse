
import { PieceType, PieceColor, BOARD_SIZE } from './constants';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  capturedPiece?: ChessPiece;
  promotion?: PieceType;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isEnPassant?: boolean;
  isCastling?: boolean;
}

// Function to check if a position is within board bounds
export const isWithinBoard = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

// Function to get the algebraic notation for a position
export const getAlgebraicNotation = (position: Position): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[position.col]}${8 - position.row}`;
};

// Function to parse algebraic notation into a position
export const parseAlgebraicNotation = (notation: string): Position | null => {
  if (notation.length !== 2) return null;
  
  const fileChar = notation.charAt(0);
  const rankChar = notation.charAt(1);
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const fileIndex = files.indexOf(fileChar);
  const rankIndex = 8 - parseInt(rankChar);
  
  if (fileIndex === -1 || rankIndex < 0 || rankIndex >= 8) return null;
  
  return { row: rankIndex, col: fileIndex };
};

// Function to get notation for a move
export const getMoveNotation = (move: Move, board: (ChessPiece | null)[][], isCheck: boolean, isCheckmate: boolean): string => {
  const fromPiece = board[move.from.row][move.from.col];
  if (!fromPiece) return '';
  
  let notation = '';
  
  // Handle castling
  if (move.isCastling) {
    if (move.to.col > move.from.col) return 'O-O'; // Kingside
    else return 'O-O-O'; // Queenside
  }
  
  // Add piece symbol (except for pawns)
  if (fromPiece.type !== PieceType.PAWN) {
    notation += fromPiece.type.charAt(0).toUpperCase();
  }
  
  // Add 'x' for captures
  if (move.capturedPiece || move.isEnPassant) {
    if (fromPiece.type === PieceType.PAWN) {
      notation += getAlgebraicNotation(move.from).charAt(0);
    }
    notation += 'x';
  }
  
  // Add destination square
  notation += getAlgebraicNotation(move.to);
  
  // Add promotion
  if (move.promotion) {
    notation += '=' + move.promotion.charAt(0).toUpperCase();
  }
  
  // Add check/checkmate symbols
  if (isCheckmate) notation += '#';
  else if (isCheck) notation += '+';
  
  return notation;
};
