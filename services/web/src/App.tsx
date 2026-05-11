import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className="app">
      <main className="mobile-container">
        <Routes>
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
