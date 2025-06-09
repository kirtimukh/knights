import React, { useState, useRef, useEffect } from 'react';

const ScoreBoard = ({ scoreState, boardSize }) => {
    const theStyle = `mt-4 grid gap-2 text-xs sm:text-sm place-items-center`

    return (
        <div className={theStyle} style={{ width: boardSize, gridTemplateColumns: 'repeat(5, 1fr)' }} >
            <div>❤️ Health: {scoreState.health}</div>
            <div>🔥 Streak: {scoreState.streak}</div>
            <div>⬆️ Increment: {scoreState.increment}</div>
            <div>⭐ Score: {scoreState.score}</div>
            <div>🎯 Optimum: {scoreState.bestMoveCount}</div>
        </div>
    );
};

export default ScoreBoard;
