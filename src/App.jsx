import './App.css'

import Board from '@/components/Board'

function App() {
    return (
        <>
        <div className="min-h-screen flex flex-col">

            <div className='fixed text-xl text-slate-500 font-mono z-50'>Knight In Gale</div>
            <div className="grid place-items-center flex-grow">
                <Board />
            </div>
            <div className='w-full text-slate-500 text-base font-mono z-50 flex justify-center py-2'>
                <p className='flex'>&copy; ubworkshops.com</p>
            </div>

            </div>
        </>
    )
}

export default App
