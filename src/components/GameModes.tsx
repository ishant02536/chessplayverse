
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/lib/gameState';
import { GameMode, AIDifficulty } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface GameModesProps {
  onClose: () => void;
}

const GameModes: React.FC<GameModesProps> = ({ onClose }) => {
  const { initGame, gameMode, aiDifficulty, setAIDifficulty } = useGameState();
  const [selectedMode, setSelectedMode] = React.useState<GameMode>(gameMode);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<AIDifficulty>(aiDifficulty);

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleDifficultyChange = (difficulty: AIDifficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    initGame(selectedMode, selectedDifficulty);
    onClose();
  };

  return (
    <Card className="max-w-md w-full animate-scale-in shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Select Game Mode</CardTitle>
        <CardDescription>Choose how you want to play</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => handleModeChange(value as GameMode)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GameMode.PLAYER_VS_PLAYER} id="player-vs-player" />
              <Label htmlFor="player-vs-player" className="cursor-pointer">
                Player vs Player (local)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GameMode.PLAYER_VS_AI} id="player-vs-ai" />
              <Label htmlFor="player-vs-ai" className="cursor-pointer">
                Player vs Computer
              </Label>
            </div>
          </RadioGroup>
        </div>

        {selectedMode === GameMode.PLAYER_VS_AI && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Difficulty</Label>
            <RadioGroup
              value={selectedDifficulty}
              onValueChange={(value) => handleDifficultyChange(value as AIDifficulty)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AIDifficulty.EASY} id="easy" />
                <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AIDifficulty.MEDIUM} id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AIDifficulty.HARD} id="hard" />
                <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AIDifficulty.EXPERT} id="expert" />
                <Label htmlFor="expert" className="cursor-pointer">Expert</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameModes;
