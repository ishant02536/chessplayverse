
import { PieceType, PieceColor, BOARD_SIZE } from './constants';
import { ChessPiece, Position, Move, isWithinBoard } from './chessPieces';

// Get all valid moves for a piece
export function getValidMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  currentPlayer: PieceColor
): Position[] {
  const piece = board[position.row][position.col];
  if (!piece || piece.color !== currentPlayer) return [];

  const potentialMoves = getPotentialMoves(board, position);
  
  // Filter out moves that would leave the king in check
  return potentialMoves.filter(move => {
    const testBoard = simulateMove(board, position, move);
    return !isKingInCheck(testBoard, currentPlayer);
  });
}

// Get potential moves without checking if they leave the king in check
function getPotentialMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const { row, col } = position;
  const moves: Position[] = [];

  switch (piece.type) {
    case PieceType.PAWN:
      moves.push(...getPawnMoves(board, position, piece.color));
      break;
    case PieceType.KNIGHT:
      moves.push(...getKnightMoves(board, position, piece.color));
      break;
    case PieceType.BISHOP:
      moves.push(...getBishopMoves(board, position, piece.color));
      break;
    case PieceType.ROOK:
      moves.push(...getRookMoves(board, position, piece.color));
      break;
    case PieceType.QUEEN:
      moves.push(...getBishopMoves(board, position, piece.color));
      moves.push(...getRookMoves(board, position, piece.color));
      break;
    case PieceType.KING:
      moves.push(...getKingMoves(board, position, piece.color));
      break;
  }

  return moves;
}

// Get pawn moves
function getPawnMoves(board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] {
  const { row, col } = position;
  const moves: Position[] = [];
  const direction = color === PieceColor.WHITE ? -1 : 1;
  const startingRow = color === PieceColor.WHITE ? 6 : 1;

  // Move forward one square
  const oneForward = { row: row + direction, col };
  if (isWithinBoard(oneForward.row, oneForward.col) && !board[oneForward.row][oneForward.col]) {
    moves.push(oneForward);

    // Move forward two squares from starting position
    if (row === startingRow) {
      const twoForward = { row: row + 2 * direction, col };
      if (!board[twoForward.row][twoForward.col]) {
        moves.push(twoForward);
      }
    }
  }

  // Capture diagonally
  const captures = [
    { row: row + direction, col: col - 1 },
    { row: row + direction, col: col + 1 }
  ];

  for (const capture of captures) {
    if (isWithinBoard(capture.row, capture.col)) {
      const targetPiece = board[capture.row][capture.col];
      if (targetPiece && targetPiece.color !== color) {
        moves.push(capture);
      }
      
      // TODO: Add en passant logic here
    }
  }

  return moves;
}

// Get knight moves
function getKnightMoves(board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] {
  const { row, col } = position;
  const moves: Position[] = [];
  const knightMoves = [
    { row: row - 2, col: col - 1 },
    { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 },
    { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 },
    { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 },
    { row: row + 2, col: col + 1 }
  ];

  for (const move of knightMoves) {
    if (isWithinBoard(move.row, move.col)) {
      const targetPiece = board[move.row][move.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(move);
      }
    }
  }

  return moves;
}

// Get bishop moves
function getBishopMoves(board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] {
  const { row, col } = position;
  const moves: Position[] = [];
  const directions = [
    { rowDir: -1, colDir: -1 }, // top-left
    { rowDir: -1, colDir: 1 },  // top-right
    { rowDir: 1, colDir: -1 },  // bottom-left
    { rowDir: 1, colDir: 1 }    // bottom-right
  ];

  for (const dir of directions) {
    let currentRow = row + dir.rowDir;
    let currentCol = col + dir.colDir;

    while (isWithinBoard(currentRow, currentCol)) {
      const targetPiece = board[currentRow][currentCol];
      
      if (!targetPiece) {
        moves.push({ row: currentRow, col: currentCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: currentRow, col: currentCol });
        }
        break; // Stop in this direction after finding a piece
      }

      currentRow += dir.rowDir;
      currentCol += dir.colDir;
    }
  }

  return moves;
}

// Get rook moves
function getRookMoves(board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] {
  const { row, col } = position;
  const moves: Position[] = [];
  const directions = [
    { rowDir: -1, colDir: 0 }, // up
    { rowDir: 1, colDir: 0 },  // down
    { rowDir: 0, colDir: -1 }, // left
    { rowDir: 0, colDir: 1 }   // right
  ];

  for (const dir of directions) {
    let currentRow = row + dir.rowDir;
    let currentCol = col + dir.colDir;

    while (isWithinBoard(currentRow, currentCol)) {
      const targetPiece = board[currentRow][currentCol];
      
      if (!targetPiece) {
        moves.push({ row: currentRow, col: currentCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: currentRow, col: currentCol });
        }
        break; // Stop in this direction after finding a piece
      }

      currentRow += dir.rowDir;
      currentCol += dir.colDir;
    }
  }

  return moves;
}

// Get king moves
function getKingMoves(board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] {
  const { row, col } = position;
  const moves: Position[] = [];
  const kingMoves = [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col },
    { row: row - 1, col: col + 1 },
    { row, col: col - 1 },
    { row, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col },
    { row: row + 1, col: col + 1 }
  ];

  for (const move of kingMoves) {
    if (isWithinBoard(move.row, move.col)) {
      const targetPiece = board[move.row][move.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(move);
      }
    }
  }

  // TODO: Add castling logic here

  return moves;
}

// Simulate a move to test if it would leave the king in check
function simulateMove(board: (ChessPiece | null)[][], from: Position, to: Position): (ChessPiece | null)[][] {
  // Create a deep copy of the board
  const newBoard = board.map(row => [...row]);
  
  // Move the piece
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  
  return newBoard;
}

// Check if the king is in check
export function isKingInCheck(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // Find the king's position
  let kingPosition: Position | null = null;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PieceType.KING && piece.color === color) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }
  
  if (!kingPosition) return false; // Should never happen in a valid game
  
  // Check if any opponent piece can capture the king
  const opponentColor = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getPotentialMoves(board, { row, col });
        for (const move of moves) {
          if (move.row === kingPosition.row && move.col === kingPosition.col) {
            return true; // King is in check
          }
        }
      }
    }
  }
  
  return false;
}

// Check if the king is in checkmate
export function isCheckmate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // First, check if the king is in check
  if (!isKingInCheck(board, color)) return false;
  
  // Try all possible moves for all pieces of the current player
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col }, color);
        if (moves.length > 0) return false; // If any valid move exists, it's not checkmate
      }
    }
  }
  
  return true; // No valid moves and king is in check = checkmate
}

// Check if the game is a draw
export function isDraw(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // If the king is not in check but the player has no valid moves, it's a stalemate
  if (!isKingInCheck(board, color)) {
    let hasValidMoves = false;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const moves = getValidMoves(board, { row, col }, color);
          if (moves.length > 0) {
            hasValidMoves = true;
            break;
          }
        }
      }
      if (hasValidMoves) break;
    }
    
    if (!hasValidMoves) return true; // Stalemate
  }
  
  // TODO: Add other draw conditions (insufficient material, 50-move rule, threefold repetition)
  
  return false;
}

// Make a move on the board
export function makeMove(
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  promotion?: PieceType
): { newBoard: (ChessPiece | null)[][]; move: Move } | null {
  const piece = board[from.row][from.col];
  if (!piece) return null;
  
  // Create a deep copy of the board
  const newBoard = board.map(row => [...row]);
  
  // Prepare the move object
  const move: Move = {
    from,
    to,
    capturedPiece: newBoard[to.row][to.col] || undefined,
  };
  
  // Handle promotion
  if (
    piece.type === PieceType.PAWN &&
    ((piece.color === PieceColor.WHITE && to.row === 0) ||
     (piece.color === PieceColor.BLACK && to.row === 7))
  ) {
    if (promotion) {
      move.promotion = promotion;
      newBoard[to.row][to.col] = { type: promotion, color: piece.color };
      newBoard[from.row][from.col] = null;
    } else {
      // Default to queen if no promotion piece specified
      move.promotion = PieceType.QUEEN;
      newBoard[to.row][to.col] = { type: PieceType.QUEEN, color: piece.color };
      newBoard[from.row][from.col] = null;
    }
  } else {
    // Regular move
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
  }
  
  // TODO: Handle special moves (castling, en passant)
  
  return { newBoard, move };
}

// Find the best move for the AI
export function findBestMove(
  board: (ChessPiece | null)[][],
  color: PieceColor,
  depth: number
): Move | null {
  let bestMove: Move | null = null;
  let bestScore = color === PieceColor.WHITE ? -Infinity : Infinity;
  
  // Try all possible moves
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col }, color);
        
        for (const move of moves) {
          const result = makeMove(board, { row, col }, move);
          if (!result) continue;
          
          const { newBoard } = result;
          const score = minimax(newBoard, depth - 1, color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE, -Infinity, Infinity, color === PieceColor.WHITE);
          
          if ((color === PieceColor.WHITE && score > bestScore) || 
              (color === PieceColor.BLACK && score < bestScore)) {
            bestScore = score;
            bestMove = {
              from: { row, col },
              to: move
            };
          }
        }
      }
    }
  }
  
  return bestMove;
}

// Minimax algorithm for AI move evaluation
function minimax(
  board: (ChessPiece | null)[][],
  depth: number,
  currentPlayer: PieceColor,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number {
  // Base case: if depth is 0 or game is over, evaluate the board
  if (depth === 0 || isCheckmate(board, currentPlayer) || isDraw(board, currentPlayer)) {
    return evaluateBoard(board);
  }
  
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    
    // Try all possible moves for the current player
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.color === currentPlayer) {
          const moves = getValidMoves(board, { row, col }, currentPlayer);
          
          for (const move of moves) {
            const result = makeMove(board, { row, col }, move);
            if (!result) continue;
            
            const { newBoard } = result;
            const eval = minimax(newBoard, depth - 1, currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            
            if (beta <= alpha) break; // Alpha-beta pruning
          }
        }
      }
    }
    
    return maxEval;
  } else {
    let minEval = Infinity;
    
    // Try all possible moves for the current player
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.color === currentPlayer) {
          const moves = getValidMoves(board, { row, col }, currentPlayer);
          
          for (const move of moves) {
            const result = makeMove(board, { row, col }, move);
            if (!result) continue;
            
            const { newBoard } = result;
            const eval = minimax(newBoard, depth - 1, currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            
            if (beta <= alpha) break; // Alpha-beta pruning
          }
        }
      }
    }
    
    return minEval;
  }
}

// Evaluate the board position (simple evaluation for now)
function evaluateBoard(board: (ChessPiece | null)[][]): number {
  let score = 0;
  
  // Piece values
  const pieceValues = {
    [PieceType.PAWN]: 1,
    [PieceType.KNIGHT]: 3,
    [PieceType.BISHOP]: 3,
    [PieceType.ROOK]: 5,
    [PieceType.QUEEN]: 9,
    [PieceType.KING]: 100
  };
  
  // Sum the values of all pieces
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        if (piece.color === PieceColor.WHITE) {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  
  return score;
}
