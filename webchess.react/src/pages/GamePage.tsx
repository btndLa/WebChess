import React from 'react';


// Utility function to parse FEN and return a 2D array of piece symbols
function parseFen(fen: string): (string | null)[][] {
  const rows = fen.split(' ')[0].split('/');
  return rows.map(row => {
    const result: (string | null)[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < Number(char); i++) result.push(null);
      } else {
        result.push(char);
      }
    }
    return result;
  });
}

const PIECE_UNICODE: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

export function GamePage() {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const board = parseFen(fen);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => {
                const isDark = (rowIdx + colIdx) % 2 === 1;
                return (
                  <td
                    key={colIdx}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: isDark ? '#769656' : '#eeeed2',
                      border: '1px solid #333',
                      textAlign: 'center',
                      fontSize: 28,
                    }}
                  >
                    {cell ? PIECE_UNICODE[cell] : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GamePage;
