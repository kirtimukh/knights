import React, { useEffect, useReducer, useState } from 'react';
import { knight01, knight02, square01 } from '@/assets/images';
import {
    getKnightMoves,
    isKnightMoveValid,
    getRandomKnightPos,
    getMinKnightMoves
} from '@/utils'
import CountdownTimer from '@/components/Timer'


const Cell = ({
    row,
    col,
    rowLabel,
    colLabel,
    knightPos,
    allowedMoves,
    showValidMoves,
    destination
}) => {
    const isBlack = (row + col) % 2 === 1;
    const cellColor = isBlack ? 'bg-green-500' : 'bg-white';
    const label = `${colLabel}${rowLabel}`;
    const isKnightHere = knightPos.label === label;
    const isValidMove = showValidMoves && isKnightMoveValid({ label, col: colLabel, row: rowLabel }, allowedMoves);
    const isDestination = destination.label === label;

    return (
        <div className={`w-full h-full relative ${cellColor}`}>
            {isValidMove && (
                <div className="absolute inset-0 bg-indigo-400 opacity-100 pointer-events-none" />
            )}
            {isKnightHere && (
                <img
                    className={`z-10 relative ${isBlack ? 'afterGlowWhite' : ''}`}
                    src={knight02}
                    alt=""
                />
            )}
            {isDestination && (
                <img
                    className={`z-10 relative ${isBlack ? 'afterGlowWhite' : ''}`}
                    src={square01}
                    alt=""
                />
            )}
        </div>
    );
};


const startPos = getRandomKnightPos();
const targetPos = getRandomKnightPos(startPos);

const FIVE = 5
const initialScore = {
    health: FIVE,
    increment: FIVE,
    moveCount: 0,
    score: 0,
    streak: 0,
    bestMoveCount: null,
    bestStreak: 0
}


const scoreReducer = (state, action) => {
    let health, score, deduction, increment, streak, bestStreak;
    switch (action.type) {
        case 'moved':
            return { ...state, moveCount: state.moveCount + 1 };
        case 'arrived':
            deduction = state.moveCount + 1 !== state.bestMoveCount ? 1 : 0;
            health = state.health - deduction

            if (health < 1) {
                return {...state, health}
            }

            increment = state.increment

            streak = state.streak
            if (deduction === 0) { streak += 1 }
            else { streak = 0 }

            if (deduction === 0 && streak > 2 && increment < FIVE) {
                increment += 1
            } else if (deduction !== 0) {
                increment -= 1
            }

            score = state.score + increment

            bestStreak = Math.max(state.bestStreak, streak)

            return { health, score, streak, increment, bestStreak, moveCount: 0, bestMoveCount: action.payload.newBestMoveCount };
        case 'timeout':
            return { ...action.payload };
        case 'reset':
            return { ...initialScore, ...action.payload };
        default:
            return state;
    }
};


const Board = () => {
    const [boardSize, setBoardSize] = useState(0);
    const [screenSize, setScreenSize] = useState(0);
    const [gameOn, setGameOn] = useState(false)

    const [knightPos, setKnightPos] = useState(startPos);
    const [allowedMoves, setAllowedMoves] = useState(getKnightMoves(startPos));
    const [showValidMoves, setShowValidMoves] = useState(false);

    const startingScore = { ...initialScore, bestMoveCount: getMinKnightMoves(startPos.label, targetPos.label) };
    const [scoreState, scoreDispatch] = useReducer(scoreReducer, startingScore);

    const [destination, setDestination] = useState(targetPos);

    const updateBoardSize = () => {
        const screenSide = Math.min(window.innerWidth, window.innerHeight);
        let side;
        if (window.innerWidth > window.innerHeight) {
            side = 'vh';
        } else {
            side = 'vw'
        }
        setScreenSize(screenSide);
        if (screenSide < 700) {
            setBoardSize(`100${side}`)
        } else {
            setBoardSize(`85${side}`);
        }
    };

    useEffect(() => {
        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);
        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    //   useEffect(() => {
    //     scoreDispatch({type:'reset', payload: {bestMoveCount: getMinKnightMoves(knightPos.label, destination.label)}})
    //   }, [gameOn])

    function resetGame() {
        scoreDispatch({ type: 'reset', payload: { bestMoveCount: getMinKnightMoves(knightPos.label, destination.label) } })
    }

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rowLabels = ['8', '7', '6', '5', '4', '3', '2', '1']; // top to bottom
    const numRows = 8;
    const numCols = 8;

    function handleCellClick(colLabel, rowLabel) {
        if (!gameOn) return
        const currentKnightPosition = { col: colLabel, row: rowLabel, label: `${colLabel}${rowLabel}` }

        if (knightPos.label === `${colLabel}${rowLabel}`) {
            setShowValidMoves(prev => !prev);
        } else if (isKnightMoveValid(currentKnightPosition, allowedMoves)) {
            if (destination.label === `${colLabel}${rowLabel}`) {
                const newDestination = getRandomKnightPos(currentKnightPosition);
                const newBestMoveCount = getMinKnightMoves(currentKnightPosition.label, newDestination.label)

                scoreDispatch({ type: 'arrived', payload: { newBestMoveCount } });
                setDestination(newDestination);

            } else { scoreDispatch({ type: 'moved' }) }
            setKnightPos(currentKnightPosition);
            setAllowedMoves(getKnightMoves(currentKnightPosition));
        }
    }

    const atagstyle = "text-blue-600 hover:text-blue-800 underline"

    const textGoldSquare =  <div className='bg-white inline'>Gold Square</div>
    const textOmc = <div className='bg-white inline'>🎯 Optimal</div>
    const textIncre = <div className='bg-white inline'>⬆️ Increment</div>
    const textStreak = <div className='bg-white inline'>🔥 Streak</div>
    const textScore = <div className='bg-white inline'>⭐ Score</div>

    const theStyle = `mt-1 mb-4 grid gap-2 text-xs sm:text-sm place-items-center`

    const smallScreen = screenSize < 470;

    return (
        <>
            <div className=''>
                <CountdownTimer scoreState={scoreState} boardSize={boardSize} setGameOn={setGameOn} resetGame={resetGame} allowedMoves={allowedMoves} smallScreen={smallScreen}/>
                <div
                    className="grid"
                    style={{
                        width: boardSize,
                        height: boardSize,
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gridTemplateRows: `repeat(8, 1fr)`,
                    }}
                >
                    {/* 8x8 board cells, top-down rendering */}
                    {rowLabels.map((rowLabel, rowIdxFromTop) =>
                        columns.map((colLabel, colIdx) => {
                            const actualRowIdx = numRows - 1 - rowIdxFromTop; // so 0 = row 7 (bottom), 7 = row 0 (top)
                            return (
                                <div key={`${rowIdxFromTop}-${colIdx}`} onClick={() => handleCellClick(colLabel, rowLabel)}>
                                    <Cell row={actualRowIdx} col={colIdx} rowLabel={rowLabel} colLabel={colLabel} knightPos={knightPos} allowedMoves={allowedMoves} showValidMoves={showValidMoves} destination={destination} />
                                </div>
                            );
                        })
                    )}
                    <div />
                </div>
                <div>
                    <div className={theStyle} style={{ width: boardSize, gridTemplateColumns: 'repeat(5, 1fr)' }} >
                        <div className='col-start-4 justify-self-end'>
                            🔥 {!smallScreen && 'Best Streak:'} {scoreState.bestStreak}
                        </div>
                        <div className='col-start-5 justify-self-end'>
                            🎯 {!smallScreen && 'Optimal:'} {scoreState.bestMoveCount}
                        </div>
                    </div>
                </div>
                <div className={`text-sm ${screenSize < 700 && 'px-2'}`} style={{width: boardSize}}>
                    <p className='text-lg font-bold'>How to play:</p>
                    <ul className='list-disc px-3'>
                        <li>Move to {textGoldSquare} with least number of moves.</li>
                        <li>{textOmc} is the least number of moves to reach {textGoldSquare}.</li>
                        <li>❤️ decreases if you donot reach {textGoldSquare} in 🎯 moves.</li>
                        <li>⬆️ decreases if you donot reach {textGoldSquare} in 🎯 moves.</li>
                        <li>Set best moves {textStreak} to 3 to recover ⬆️.</li>
                        <li>⭐ goes up by ⬆️ when you reach {textGoldSquare}.</li>
                    </ul>
                    <p className='text-lg font-bold'>Credits:</p><a target="_blank" className={atagstyle} href="https://icons8.com/icon/jBuT5I9R4aNN/knight">Knight</a> and <a target="_blank" className={atagstyle} href="https://icons8.com/icon/123950/square-border">Square Border</a> by <a target="_blank" className={atagstyle} href="https://icons8.com">Icons8</a>
                </div>
            </div>
        </>
    );
};

export default Board;
