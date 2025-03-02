
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  FastForward, 
  ArrowLeftCircle, 
  ArrowRightCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useGameState } from '@/lib/gameState';
import { GameStatus, PieceColor } from '@/lib/constants';

interface GameControlsProps {
  onFlipBoard: () => void;
  onOpenSettings: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onFlipBoard, onOpenSettings }) => {
  const { 
    resetGame, 
    undoMove, 
    moveHistory, 
    status, 
    currentPlayer 
  } = useGameState();

  return (
    <div className="game-controls w-full flex flex-col space-y-4 mt-4">
      {/* Game status banner */}
      <div className={`
        w-full p-3 rounded-md glass-panel text-center animate-fade-in
        ${status === GameStatus.CHECK || status === GameStatus.CHECKMATE 
          ? 'bg-red-500 bg-opacity-20 text-red-800' 
          : status === GameStatus.DRAW 
            ? 'bg-gray-500 bg-opacity-20 text-gray-800'
            : 'bg-opacity-10'}
      `}>
        {status === GameStatus.CHECK && <span>Check! {currentPlayer === PieceColor.WHITE ? 'White' : 'Black'} to move</span>}
        {status === GameStatus.CHECKMATE && <span>Checkmate! {currentPlayer === PieceColor.WHITE ? 'Black' : 'White'} wins</span>}
        {status === GameStatus.DRAW && <span>Draw! Game ended in a stalemate</span>}
        {status === GameStatus.ONGOING && (
          <span>{currentPlayer === PieceColor.WHITE ? 'White' : 'Black'} to move</span>
        )}
      </div>
      
      {/* Control buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetGame}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} />
          <span>New Game</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={undoMove}
          disabled={moveHistory.length === 0}
          className="flex items-center gap-1"
        >
          <RotateCcw size={16} />
          <span>Undo</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onFlipBoard}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} />
          <span>Flip Board</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpenSettings}
          className="flex items-center gap-1"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
