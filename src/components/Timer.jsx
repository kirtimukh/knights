import React, { useState, useRef, useEffect } from 'react';

const CountdownTimer = ({ scoreState, boardSize, setGameOn, resetGame, smallScreen }) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(30);
    const [remaining, setRemaining] = useState(0); // in ms
    const [running, setRunning] = useState(false);

    const initialTimeRef = useRef(0);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);

    const formatTime = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const millis = Math.floor((ms % 1000) / 10); // hundredths
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
    };

    const update = () => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        const remainingTime = Math.max(0, initialTimeRef.current - elapsed);
        setRemaining(remainingTime);
        if (remainingTime > 0) {
            rafRef.current = requestAnimationFrame(update);
        } else {
            setRunning(false);
            setGameOn(false);
        }
    };

    const handleStart = () => {
        setGameOn(true)
        resetGame()
        const totalMs = (minutes * 60 + seconds) * 1000;
        if (totalMs === 0) return;
        initialTimeRef.current = totalMs;
        startTimeRef.current = performance.now();
        setRemaining(totalMs);
        setRunning(true);
        rafRef.current = requestAnimationFrame(update);
    };

    const handleReset = () => {
        resetGame();
        cancelAnimationFrame(rafRef.current);
        setRunning(false);
        setRemaining(initialTimeRef.current);
    };

    useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current); // cleanup
    }, []);

    useEffect(() => {
        if (scoreState.health < 1) {
            setRunning(false);
            setGameOn(false);
        }

    }, [scoreState.health])

    const theStyle = `mt-4 grid gap-2 text-xs sm:text-sm place-items-center ${running ? 'py-[1px]' : ''}`

    return (
        <div className={theStyle} style={{ width: boardSize, gridTemplateColumns: 'repeat(5, 1fr)' }} >
            <div>❤️ {smallScreen? '': 'Health:' } {scoreState.health}</div>
            <div>🔥 {smallScreen? '': 'Streak:' } {scoreState.streak}</div>
            <div>⬆️ {smallScreen? '': 'Increment:' } {scoreState.increment}</div>
            <div>⭐ {smallScreen? '': 'Score:' } {scoreState.score}</div>

            <div>
                {running ?

                    <div className='flex items-center text-center font-mono'>
                        <div className="px-1 border border-transparent" style={{ width: '65%' }}>
                            {formatTime(remaining)}
                        </div>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded"
                            style={{ width: '35%' }}
                            onClick={handleReset}
                        >Reset</button>
                    </div>

                    :

                    <div className="flex items-center">
                        <input
                            type="text"
                            value={seconds}
                            onChange={e => setSeconds(Math.min(600, Math.max(0, parseInt(e.target.value) || 0)))}
                            className='px-2 py-1 border rounded'
                            style={{ width: '65%' }}
                            min="10"
                            max="600"
                            placeholder='mm'
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded"
                            style={{ width: '35%' }}
                            onClick={handleStart}
                        >
                            Start
                        </button>
                    </div>
                }

            </div>
        </div>
    );
};

export default CountdownTimer;
