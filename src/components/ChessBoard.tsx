
import React, { useState, useEffect, useRef } from 'react';
import { BOARD_SIZE, FILES, PieceColor } from '@/lib/constants';
import { Position } from '@/lib/chessPieces';
import { useGameState } from '@/lib/gameState';
import ChessPiece from './ChessPiece';

interface ChessBoardProps {
  flipped?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ flipped = false }) => {
  const {
    board,
    selectedPiece,
    validMoves,
    lastMove,
    currentPlayer,
    selectPiece,
    movePiece,
    resetSelection
  } = useGameState();

  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);

  // Update board size on window resize
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const width = Math.min(window.innerWidth * 0.8, 600);
        setBoardSize(width);
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // Handle click on a square
  const handleSquareClick = (row: number, col: number) => {
    const position: Position = { row, col };
    const piece = board[row][col];

    // If there's a piece at this position and it's current player's turn
    if (piece && piece.color === currentPlayer) {
      selectPiece(position);
    } else if (selectedPiece) {
      // Check if this is a valid move for the selected piece
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      if (isValidMove) {
        movePiece(selectedPiece, position);
      } else {
        resetSelection();
      }
    }
  };

  // Check if a position is a valid move
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  // Check if a position is the last move
  const isLastMove = (row: number, col: number): boolean => {
    return !!(lastMove && 
      ((lastMove.from.row === row && lastMove.from.col === col) || 
       (lastMove.to.row === row && lastMove.to.col === col)));
  };

  // Render the board
  const renderBoard = () => {
    const squares = [];
    const squareSize = boardSize / BOARD_SIZE;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // Adjust row and col if board is flipped
        const actualRow = flipped ? BOARD_SIZE - 1 - row : row;
        const actualCol = flipped ? BOARD_SIZE - 1 - col : col;
        
        const piece = board[actualRow][actualCol];
        const isLight = (row + col) % 2 === 0;
        const isSelected = selectedPiece?.row === actualRow && selectedPiece?.col === actualCol;
        const isPossibleMove = isValidMove(actualRow, actualCol);
        const isLastMoveSquare = isLastMove(actualRow, actualCol);
        
        squares.push(
          <div
            key={`${row}-${col}`}
            className={`relative 
              ${isLight ? 'bg-chess-light-square' : 'bg-chess-dark-square'} 
              ${isSelected ? 'chess-square-selected' : ''}
              ${isLastMoveSquare ? 'chess-square-highlighted' : ''}
              transition-all duration-200 ease-in-out
            `}
            style={{ 
              width: `${squareSize}px`, 
              height: `${squareSize}px` 
            }}
            onClick={() => handleSquareClick(actualRow, actualCol)}
          >
            {/* Rank (row) labels - show on first column */}
            {col === 0 && (
              <div className="absolute top-0 left-1 text-xs font-medium opacity-70">
                {8 - row}
              </div>
            )}
            
            {/* File (column) labels - show on last row */}
            {row === 7 && (
              <div className="absolute bottom-0 right-1 text-xs font-medium opacity-70">
                {FILES[col]}
              </div>
            )}
            
            {/* Possible move indicator */}
            {isPossibleMove && <div className="chess-square-possible-move" />}
            
            {/* Chess piece */}
            {piece && (
              <ChessPiece
                type={piece.type}
                color={piece.color}
                isSelected={isSelected}
                isDraggable={piece.color === currentPlayer}
              />
            )}
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div 
      ref={boardRef}
      className="chess-board relative mx-auto border border-gray-800 shadow-lg overflow-hidden"
      style={{ 
        width: `${boardSize}px`, 
        height: `${boardSize}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` 
      }}
    >
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;
