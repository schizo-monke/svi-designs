import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DesignDetail from './components/DesignDetail';
import SearchPage from './components/SearchPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>SVI Infinity - Drop Designs</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/design/:index" element={<DesignDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
