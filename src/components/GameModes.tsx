import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, AIDifficulty } from '@/lib/constants';
import { useGameState } from '@/lib/gameState';
import { 
  User, 
  Bot, 
  ChevronRight, 
  Globe,
  ArrowDown, 
  ArrowUp
} from 'lucide-react';

interface GameModesProps {
  onClose: () => void;
  onSelectMultiplayer?: () => void;
}

const GameModes: React.FC<GameModesProps> = ({ onClose, onSelectMultiplayer }) => {
  const { initGame, aiDifficulty, setAIDifficulty } = useGameState();
  
  const handleSelectMode = (mode: GameMode) => {
    if (mode === GameMode.MULTIPLAYER && onSelectMultiplayer) {
      onSelectMultiplayer();
      return;
    }
    
    initGame(mode, aiDifficulty);
    onClose();
  };

  const handleAdjustDifficulty = (direction: 'up' | 'down') => {
    const difficulties = [
      AIDifficulty.EASY,
      AIDifficulty.MEDIUM,
      AIDifficulty.HARD,
      AIDifficulty.EXPERT
    ];
    
    const currentIndex = difficulties.indexOf(aiDifficulty);
    let newIndex = currentIndex;
    
    if (direction === 'up' && currentIndex < difficulties.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    
    setAIDifficulty(difficulties[newIndex]);
  };

  const getDifficultyText = () => {
    switch (aiDifficulty) {
      case AIDifficulty.EASY: return 'Easy';
      case AIDifficulty.MEDIUM: return 'Medium';
      case AIDifficulty.HARD: return 'Hard';
      case AIDifficulty.EXPERT: return 'Expert';
      default: return 'Medium';
    }
  };

  return (
    <div className="game-modes flex flex-col gap-2 p-6 rounded-lg glass-panel bg-white/95 shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Choose Game Mode</h2>
      
      {/* Player vs Player */}
      <button
        className="game-mode-button flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors"
        onClick={() => handleSelectMode(GameMode.PLAYER_VS_PLAYER)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Local Play</h3>
            <p className="text-sm text-muted-foreground">Play against a friend on this device</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>
      
      {/* Player vs AI */}
      <button
        className="game-mode-button flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors"
        onClick={() => handleSelectMode(GameMode.PLAYER_VS_AI)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Bot size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Computer</h3>
            <p className="text-sm text-muted-foreground">Challenge the AI opponent</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>
      
      {/* Multiplayer */}
      <button
        className="game-mode-button flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors"
        onClick={() => handleSelectMode(GameMode.MULTIPLAYER)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Globe size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Online Multiplayer</h3>
            <p className="text-sm text-muted-foreground">Play against a friend online</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>
      
      {/* AI Difficulty */}
      <div className="mt-4 p-4 rounded-lg bg-card">
        <h3 className="text-sm font-medium mb-3">AI Difficulty</h3>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustDifficulty('down')}
            disabled={aiDifficulty === AIDifficulty.EASY}
          >
            <ArrowDown size={16} />
          </Button>
          
          <div className="text-center px-4 font-medium">
            {getDifficultyText()}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustDifficulty('up')}
            disabled={aiDifficulty === AIDifficulty.EXPERT}
          >
            <ArrowUp size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameModes;
