
import React from 'react';
import { useGameState } from '@/lib/gameState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MoveHistory: React.FC = () => {
  const { moveHistory } = useGameState();

  // Format move history into pairs of white and black moves
  const formatMoveHistory = () => {
    const formattedMoves = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      formattedMoves.push({
        moveNumber: Math.floor(i / 2) + 1,
        whiteMove: moveHistory[i]?.notation || '',
        blackMove: moveHistory[i + 1]?.notation || '',
      });
    }
    return formattedMoves;
  };

  const moves = formatMoveHistory();

  return (
    <Card className="move-history w-full overflow-hidden">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] w-full">
          <div className="px-4 py-2">
            {moves.length === 0 ? (
              <div className="text-sm text-center py-4 text-muted-foreground">
                No moves yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-normal text-muted-foreground">#</th>
                    <th className="pb-2 font-normal text-muted-foreground">White</th>
                    <th className="pb-2 font-normal text-muted-foreground">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((move) => (
                    <tr key={move.moveNumber} className="h-8 hover:bg-secondary/50">
                      <td className="text-muted-foreground">{move.moveNumber}.</td>
                      <td className="font-medium">{move.whiteMove}</td>
                      <td className="font-medium">{move.blackMove}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;
