
// Board dimensions
export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 64; // in pixels, will be responsive

// Piece types
export enum PieceType {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king',
}

// Piece colors
export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black',
}

// Game modes
export enum GameMode {
  PLAYER_VS_PLAYER = 'player-vs-player',
  PLAYER_VS_AI = 'player-vs-ai',
}

// AI difficulty levels
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

// Game status
export enum GameStatus {
  ONGOING = 'ongoing',
  CHECK = 'check',
  CHECKMATE = 'checkmate',
  STALEMATE = 'stalemate',
  DRAW = 'draw',
}

// Chess notation for files (columns)
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Initial board setup - used to reset the game
export const INITIAL_BOARD = [
  // Row 8 (index 0)
  [
    { type: PieceType.ROOK, color: PieceColor.BLACK },
    { type: PieceType.KNIGHT, color: PieceColor.BLACK },
    { type: PieceType.BISHOP, color: PieceColor.BLACK },
    { type: PieceType.QUEEN, color: PieceColor.BLACK },
    { type: PieceType.KING, color: PieceColor.BLACK },
    { type: PieceType.BISHOP, color: PieceColor.BLACK },
    { type: PieceType.KNIGHT, color: PieceColor.BLACK },
    { type: PieceType.ROOK, color: PieceColor.BLACK },
  ],
  // Row 7 (index 1)
  Array(8).fill({ type: PieceType.PAWN, color: PieceColor.BLACK }),
  // Rows 6-3 (indices 2-5)
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  // Row 2 (index 6)
  Array(8).fill({ type: PieceType.PAWN, color: PieceColor.WHITE }),
  // Row 1 (index 7)
  [
    { type: PieceType.ROOK, color: PieceColor.WHITE },
    { type: PieceType.KNIGHT, color: PieceColor.WHITE },
    { type: PieceType.BISHOP, color: PieceColor.WHITE },
    { type: PieceType.QUEEN, color: PieceColor.WHITE },
    { type: PieceType.KING, color: PieceColor.WHITE },
    { type: PieceType.BISHOP, color: PieceColor.WHITE },
    { type: PieceType.KNIGHT, color: PieceColor.WHITE },
    { type: PieceType.ROOK, color: PieceColor.WHITE },
  ],
];

// Chess piece unicode symbols
export const PIECE_SYMBOLS = {
  [PieceColor.WHITE]: {
    [PieceType.KING]: '♔',
    [PieceType.QUEEN]: '♕',
    [PieceType.ROOK]: '♖',
    [PieceType.BISHOP]: '♗',
    [PieceType.KNIGHT]: '♘',
    [PieceType.PAWN]: '♙',
  },
  [PieceColor.BLACK]: {
    [PieceType.KING]: '♚',
    [PieceType.QUEEN]: '♛',
    [PieceType.ROOK]: '♜',
    [PieceType.BISHOP]: '♝',
    [PieceType.KNIGHT]: '♞',
    [PieceType.PAWN]: '♟',
  },
};
