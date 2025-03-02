
import React from 'react';
import { PieceType, PieceColor, PIECE_SYMBOLS } from '@/lib/constants';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  isSelected?: boolean;
  isDraggable?: boolean;
  onDragStart?: () => void;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ 
  type, 
  color, 
  isSelected = false,
  isDraggable = false,
  onDragStart
}) => {
  // Use a function to get the piece URL
  const getPieceImage = (type: PieceType, color: PieceColor) => {
    return `/${color}-${type}.svg`;
  };

  // For now, use Unicode symbols, but in a real app we'd use SVG images
  const pieceSymbol = PIECE_SYMBOLS[color][type];

  return (
    <div 
      className={`chess-piece w-full h-full flex items-center justify-center select-none
        ${isSelected ? 'scale-110' : ''} 
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      draggable={isDraggable}
      onDragStart={onDragStart}
    >
      <span className={`text-4xl ${color === PieceColor.WHITE ? 'text-white' : 'text-black'}`}>
        {pieceSymbol}
      </span>
    </div>
  );
};

export default ChessPiece;
