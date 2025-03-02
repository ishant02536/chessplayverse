
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useGameState } from '@/lib/gameState';
import { Copy, CheckCircle2 } from 'lucide-react';

interface MultiplayerDialogProps {
  open: boolean;
  onClose: () => void;
}

const MultiplayerDialog: React.FC<MultiplayerDialogProps> = ({ open, onClose }) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [gameId, setGameId] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { createMultiplayerGame, joinMultiplayerGame } = useGameState();
  
  // Handle creating a new game
  const handleCreateGame = () => {
    const newGameId = createMultiplayerGame();
    setGameId(newGameId);
    
    toast({
      title: "Game created!",
      description: "Share the game code with your opponent.",
    });
  };
  
  // Handle joining an existing game
  const handleJoinGame = () => {
    if (!gameId || gameId.length < 4) {
      toast({
        title: "Invalid game code",
        description: "Please enter a valid game code.",
        variant: "destructive",
      });
      return;
    }
    
    joinMultiplayerGame(gameId);
    onClose();
    
    toast({
      title: "Game joined!",
      description: "You've joined the game successfully.",
    });
  };
  
  // Copy game ID to clipboard
  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Game code copied to clipboard!",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Multiplayer Chess</DialogTitle>
          <DialogDescription>
            Play chess with friends over the internet.
          </DialogDescription>
        </DialogHeader>
        
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${tab === 'create' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setTab('create')}
          >
            Create Game
          </button>
          <button
            className={`px-4 py-2 ${tab === 'join' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setTab('join')}
          >
            Join Game
          </button>
        </div>
        
        {/* Create Game Tab */}
        {tab === 'create' && (
          <div className="space-y-4">
            <div className="text-center">
              <Button onClick={handleCreateGame} className="w-full">
                Create New Game
              </Button>
            </div>
            
            {gameId && (
              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Share this code with your opponent:
                </div>
                <div className="flex">
                  <Input
                    value={gameId}
                    readOnly
                    className="text-lg font-mono text-center tracking-wider"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2"
                    onClick={copyGameId}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Waiting for opponent to join...
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Join Game Tab */}
        {tab === 'join' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm">
                Enter the game code shared by your friend:
              </div>
              <Input
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                className="text-lg font-mono text-center tracking-wider"
                maxLength={6}
              />
            </div>
            
            <Button onClick={handleJoinGame} className="w-full">
              Join Game
            </Button>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiplayerDialog;
