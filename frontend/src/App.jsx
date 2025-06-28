import { useState } from 'react';
import Home from './pages/Home';
import HistoryPage from './pages/HistoryPage';
import InsightTable from "./components/InsightTable";

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen p-4 font-sans">
      <nav className="flex justify-between items-center mb-6 border-b pb-4">
      <a href='/'>
       <h1 className="text-2xl font-bold text-blue-600 hover:underline">📄 Document Insight Tool</h1>
      </a>
  <div className="space-x-2">
    <button onClick={() => setView('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Upload</button>
    <button onClick={() => setView('history')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">History</button>
  </div>
</nav>


      {view === 'home' ? <Home /> : <HistoryPage />}
      <div className="max-w-5xl mx-auto mt-8">
      <InsightTable />
      </div>
    </div>
  );
}

export default App;
