function getKnightMoves(currentPos) {
    const colLabel = currentPos.col;
    const rowLabel = currentPos.row;

  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const colIdx = cols.indexOf(colLabel.toUpperCase());
  const rowIdx = rows.indexOf(rowLabel);

  if (colIdx === -1 || rowIdx === -1) return [];

  const moves = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1]
  ];

  const validMoves = [];

  for (let [dc, dr] of moves) {
    const newCol = colIdx + dc;
    const newRow = rowIdx + dr;
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
      validMoves.push({
        col: cols[newCol],
        row: rows[newRow],
        label: `${cols[newCol]}${rows[newRow]}`,
      });
    }
  }

  return validMoves;
}


function isKnightMoveValid(knightPos, validMoves) {
  return validMoves.some(move => move.label === knightPos.label);
}


function getRandomKnightPos(currentPos=null) {
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];

  let newCol, newRow, label;

  do {
    newCol = cols[Math.floor(Math.random() * 8)];
    newRow = rows[Math.floor(Math.random() * 8)];
    label = `${newCol}${newRow}`;
  } while (currentPos && currentPos.label === label);

  return {
    col: newCol,
    row: newRow,
    label,
  };
}


function getMinKnightMoves(startLabel, endLabel) {
  if (startLabel === endLabel) return 0;

  const cols = 'ABCDEFGH';
  const rows = '12345678';

  const colIdx = (c) => cols.indexOf(c);
  const rowIdx = (r) => rows.indexOf(r);

  const start = [colIdx(startLabel[0]), rowIdx(startLabel[1])];
  const end = [colIdx(endLabel[0]), rowIdx(endLabel[1])];

  const directions = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1]
  ];

  const visited = Array(8).fill(null).map(() => Array(8).fill(false));
  const queue = [[...start, 0]]; // [x, y, steps]

  while (queue.length) {
    const [x, y, steps] = queue.shift();
    if (x === end[0] && y === end[1]) return steps;

    for (let [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && !visited[nx][ny]) {
        visited[nx][ny] = true;
        queue.push([nx, ny, steps + 1]);
      }
    }
  }

  return -1; // Should never happen on an 8x8 board
}


export {
    getKnightMoves,
    isKnightMoveValid,
    getRandomKnightPos,
    getMinKnightMoves
}
