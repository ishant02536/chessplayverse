
// Board size
export const BOARD_SIZE = 8;

// Chess files (columns)
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Piece colors
export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black'
}

// Piece types
export enum PieceType {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king'
}

// Game modes
export enum GameMode {
  PLAYER_VS_PLAYER = 'player_vs_player',
  PLAYER_VS_AI = 'player_vs_ai',
  MULTIPLAYER = 'multiplayer'
}

// AI difficulty levels
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// Game status
export enum GameStatus {
  ONGOING = 'ongoing',
  CHECK = 'check',
  CHECKMATE = 'checkmate',
  DRAW = 'draw'
}

// Chess piece Unicode symbols
export const PIECE_SYMBOLS = {
  [PieceColor.WHITE]: {
    [PieceType.PAWN]: '♙',
    [PieceType.KNIGHT]: '♘',
    [PieceType.BISHOP]: '♗',
    [PieceType.ROOK]: '♖',
    [PieceType.QUEEN]: '♕',
    [PieceType.KING]: '♔'
  },
  [PieceColor.BLACK]: {
    [PieceType.PAWN]: '♟',
    [PieceType.KNIGHT]: '♞',
    [PieceType.BISHOP]: '♝',
    [PieceType.ROOK]: '♜',
    [PieceType.QUEEN]: '♛',
    [PieceType.KING]: '♚'
  }
};

// Initial chess board setup
export const INITIAL_BOARD = [
  // Row 0 (Black back row)
  [
    { type: PieceType.ROOK, color: PieceColor.BLACK },
    { type: PieceType.KNIGHT, color: PieceColor.BLACK },
    { type: PieceType.BISHOP, color: PieceColor.BLACK },
    { type: PieceType.QUEEN, color: PieceColor.BLACK },
    { type: PieceType.KING, color: PieceColor.BLACK },
    { type: PieceType.BISHOP, color: PieceColor.BLACK },
    { type: PieceType.KNIGHT, color: PieceColor.BLACK },
    { type: PieceType.ROOK, color: PieceColor.BLACK }
  ],
  // Row 1 (Black pawns)
  [
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK },
    { type: PieceType.PAWN, color: PieceColor.BLACK }
  ],
  // Rows 2-5 (Empty squares)
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  // Row 6 (White pawns)
  [
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE },
    { type: PieceType.PAWN, color: PieceColor.WHITE }
  ],
  // Row 7 (White back row)
  [
    { type: PieceType.ROOK, color: PieceColor.WHITE },
    { type: PieceType.KNIGHT, color: PieceColor.WHITE },
    { type: PieceType.BISHOP, color: PieceColor.WHITE },
    { type: PieceType.QUEEN, color: PieceColor.WHITE },
    { type: PieceType.KING, color: PieceColor.WHITE },
    { type: PieceType.BISHOP, color: PieceColor.WHITE },
    { type: PieceType.KNIGHT, color: PieceColor.WHITE },
    { type: PieceType.ROOK, color: PieceColor.WHITE }
  ]
];
