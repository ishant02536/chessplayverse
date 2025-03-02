
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ChessBoard from '@/components/ChessBoard';
import GameControls from '@/components/GameControls';
import MoveHistory from '@/components/MoveHistory';
import GameModes from '@/components/GameModes';
import MultiplayerDialog from '@/components/MultiplayerDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameStatus, PieceColor, GameMode } from '@/lib/constants';
import { useGameState } from '@/lib/gameState';

const Index: React.FC = () => {
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [multiplayerOpen, setMultiplayerOpen] = useState(false);
  const { toast } = useToast();
  const { 
    status, 
    currentPlayer, 
    gameMode, 
    playerColor, 
    gameId, 
    waitingForOpponent, 
    opponentConnected 
  } = useGameState();

  // Handle flip board
  const handleFlipBoard = () => {
    setBoardFlipped(!boardFlipped);
  };

  // Show toast when game status changes
  React.useEffect(() => {
    if (status === GameStatus.CHECK) {
      toast({
        title: "Check!",
        description: `${currentPlayer === PieceColor.WHITE ? "White" : "Black"} king is in check.`,
        variant: "destructive",
      });
    } else if (status === GameStatus.CHECKMATE) {
      toast({
        title: "Checkmate!",
        description: `${currentPlayer === PieceColor.WHITE ? "Black" : "White"} wins the game.`,
        variant: "default",
      });
    } else if (status === GameStatus.DRAW) {
      toast({
        title: "Draw!",
        description: "The game has ended in a draw.",
        variant: "default",
      });
    }
  }, [status, currentPlayer, toast]);

  // Open the multiplayer dialog when user selects multiplayer mode
  const handleOpenMultiplayer = () => {
    setMultiplayerOpen(true);
    setSettingsOpen(false);
  };

  // Auto-flip board based on player color in multiplayer mode
  useEffect(() => {
    if (gameMode === GameMode.MULTIPLAYER && playerColor === PieceColor.BLACK) {
      setBoardFlipped(true);
    }
  }, [gameMode, playerColor]);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-4xl font-serif font-semibold tracking-tight text-foreground">
          Chess
        </h1>
        <p className="text-muted-foreground mt-2">Play against a friend or practice with the computer</p>
      </header>

      {/* Multiplayer status banner */}
      {gameMode === GameMode.MULTIPLAYER && gameId && (
        <div className={`px-4 py-2 mx-auto mb-4 max-w-md text-center rounded-md ${waitingForOpponent ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {waitingForOpponent ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-yellow-500 rounded-full" />
              <span>Waiting for opponent to join... Game Code: <span className="font-mono font-bold">{gameId}</span></span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Playing as {playerColor === PieceColor.WHITE ? 'White' : 'Black'}</span>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow chess-container grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Chess board */}
        <div className="md:col-span-3 flex flex-col items-center">
          <ChessBoard flipped={boardFlipped} />
          <GameControls 
            onFlipBoard={handleFlipBoard} 
            onOpenSettings={() => setSettingsOpen(true)} 
          />
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <MoveHistory />
          {/* Game info and more controls could go here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with elegance, built with precision</p>
        <p className="mt-1 font-semibold">Made by Ishant</p>
      </footer>

      {/* Game mode dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <GameModes 
            onClose={() => setSettingsOpen(false)} 
            onSelectMultiplayer={handleOpenMultiplayer}
          />
        </DialogContent>
      </Dialog>

      {/* Multiplayer dialog */}
      <MultiplayerDialog 
        open={multiplayerOpen} 
        onClose={() => setMultiplayerOpen(false)} 
      />
    </div>
  );
};

export default Index;
