
import { create } from 'zustand';
import { PieceColor, PieceType, GameMode, AIDifficulty, GameStatus, INITIAL_BOARD } from './constants';
import { ChessPiece, Position, Move, getMoveNotation } from './chessPieces';
import { getValidMoves, makeMove, isKingInCheck, isCheckmate, isDraw, findBestMove } from './chessEngine';

interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  selectedPiece: Position | null;
  validMoves: Position[];
  moveHistory: {
    move: Move;
    notation: string;
    boardState: (ChessPiece | null)[][];
  }[];
  status: GameStatus;
  lastMove: Move | null;
  isPromoting: boolean;
  promotionPosition: Position | null;
  
  // Methods
  initGame: (mode: GameMode, difficulty?: AIDifficulty) => void;
  selectPiece: (position: Position) => void;
  movePiece: (from: Position, to: Position, promotion?: PieceType) => void;
  resetSelection: () => void;
  undoMove: () => void;
  resetGame: () => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  makeAIMove: () => void;
}

// Helper function to create a deep copy of the board
const cloneBoard = (board: (ChessPiece | null)[][]): (ChessPiece | null)[][] => {
  return board.map(row => [...row]);
};

// Create the game state store
export const useGameState = create<GameState>((set, get) => ({
  board: cloneBoard(INITIAL_BOARD),
  currentPlayer: PieceColor.WHITE,
  gameMode: GameMode.PLAYER_VS_PLAYER,
  aiDifficulty: AIDifficulty.MEDIUM,
  selectedPiece: null,
  validMoves: [],
  moveHistory: [],
  status: GameStatus.ONGOING,
  lastMove: null,
  isPromoting: false,
  promotionPosition: null,
  
  // Initialize the game with the specified mode and difficulty
  initGame: (mode, difficulty) => {
    set({
      board: cloneBoard(INITIAL_BOARD),
      currentPlayer: PieceColor.WHITE,
      gameMode: mode,
      aiDifficulty: difficulty || AIDifficulty.MEDIUM,
      selectedPiece: null,
      validMoves: [],
      moveHistory: [],
      status: GameStatus.ONGOING,
      lastMove: null,
      isPromoting: false,
      promotionPosition: null,
    });
  },
  
  // Select a piece and calculate valid moves
  selectPiece: (position) => {
    const { board, currentPlayer, selectedPiece } = get();
    const piece = board[position.row][position.col];
    
    // If the same piece is selected again, deselect it
    if (selectedPiece && selectedPiece.row === position.row && selectedPiece.col === position.col) {
      set({ selectedPiece: null, validMoves: [] });
      return;
    }
    
    // Check if there's a piece at the position and it belongs to the current player
    if (piece && piece.color === currentPlayer) {
      const validMoves = getValidMoves(board, position, currentPlayer);
      set({ selectedPiece: position, validMoves });
    }
  },
  
  // Move a piece on the board
  movePiece: (from, to, promotion) => {
    const { board, currentPlayer, moveHistory, status } = get();
    
    // Check for pawn promotion
    const piece = board[from.row][from.col];
    if (
      piece && 
      piece.type === PieceType.PAWN && 
      ((piece.color === PieceColor.WHITE && to.row === 0) || 
       (piece.color === PieceColor.BLACK && to.row === 7))
    ) {
      if (!promotion) {
        // Show promotion dialog
        set({ isPromoting: true, promotionPosition: to });
        return;
      }
    }
    
    const result = makeMove(board, from, to, promotion);
    if (!result) return;
    
    const { newBoard, move } = result;
    
    // Check if the move results in check or checkmate for the opponent
    const nextPlayer = currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    const isInCheck = isKingInCheck(newBoard, nextPlayer);
    const isInCheckmate = isInCheck && isCheckmate(newBoard, nextPlayer);
    const gameIsDraw = isDraw(newBoard, nextPlayer);
    
    // Update game status
    let newStatus = GameStatus.ONGOING;
    if (isInCheckmate) {
      newStatus = GameStatus.CHECKMATE;
    } else if (isInCheck) {
      newStatus = GameStatus.CHECK;
    } else if (gameIsDraw) {
      newStatus = GameStatus.DRAW;
    }
    
    // Record the move
    const moveNotation = getMoveNotation(move, board, isInCheck, isInCheckmate);
    
    // Update state
    set({
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPiece: null,
      validMoves: [],
      lastMove: move,
      status: newStatus,
      moveHistory: [...moveHistory, {
        move,
        notation: moveNotation,
        boardState: cloneBoard(board) // Save the board state before the move
      }],
      isPromoting: false,
      promotionPosition: null,
    });
    
    // If playing against AI and it's AI's turn, make AI move
    if (get().gameMode === GameMode.PLAYER_VS_AI && get().currentPlayer === PieceColor.BLACK && newStatus === GameStatus.ONGOING) {
      // Use a slight delay to make the AI move appear more natural
      setTimeout(() => {
        get().makeAIMove();
      }, 500);
    }
  },
  
  // Reset the current selection
  resetSelection: () => {
    set({ selectedPiece: null, validMoves: [] });
  },
  
  // Undo the last move
  undoMove: () => {
    const { moveHistory } = get();
    if (moveHistory.length === 0) return;
    
    const previousState = moveHistory[moveHistory.length - 1];
    
    set(state => ({
      board: previousState.boardState,
      currentPlayer: state.currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE,
      selectedPiece: null,
      validMoves: [],
      moveHistory: moveHistory.slice(0, -1),
      status: GameStatus.ONGOING, // Reset status when undoing
      lastMove: moveHistory.length > 1 ? moveHistory[moveHistory.length - 2].move : null,
    }));
  },
  
  // Reset the game
  resetGame: () => {
    set({
      board: cloneBoard(INITIAL_BOARD),
      currentPlayer: PieceColor.WHITE,
      selectedPiece: null,
      validMoves: [],
      moveHistory: [],
      status: GameStatus.ONGOING,
      lastMove: null,
      isPromoting: false,
      promotionPosition: null,
    });
  },
  
  // Set AI difficulty
  setAIDifficulty: (difficulty) => {
    set({ aiDifficulty: difficulty });
  },
  
  // Make AI move
  makeAIMove: () => {
    const { board, currentPlayer, aiDifficulty } = get();
    
    // Simple implementation - this will be expanded in chessEngine.ts
    setTimeout(() => {
      const aiMove = findBestMove(board, currentPlayer, aiDifficulty);
      if (aiMove) {
        get().movePiece(aiMove.from, aiMove.to);
      }
    }, 500);
  },
}));
