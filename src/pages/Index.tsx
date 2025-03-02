
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ChessBoard from '@/components/ChessBoard';
import GameControls from '@/components/GameControls';
import MoveHistory from '@/components/MoveHistory';
import GameModes from '@/components/GameModes';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameStatus, PieceColor } from '@/lib/constants';
import { useGameState } from '@/lib/gameState';

const Index: React.FC = () => {
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const { toast } = useToast();
  const { status, currentPlayer } = useGameState();

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

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-4xl font-serif font-semibold tracking-tight text-foreground">
          Chess
        </h1>
        <p className="text-muted-foreground mt-2">Play against a friend or practice with the computer</p>
      </header>

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
      </footer>

      {/* Game mode dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <GameModes onClose={() => setSettingsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
