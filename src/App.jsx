import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DesignDetail from './components/DesignDetail';
import SearchPage from './components/SearchPage';
import StatsPage from './components/StatsPage';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <ThemeToggle />
          <header className="app-header">
            <h1>SVI Infinity - Drop Designs</h1>
            <nav className="app-nav">
              <Link to="/" className="app-nav-link">Designs</Link>
              <Link to="/stats" className="app-nav-link">Statistics</Link>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/design/:index" element={<DesignDetail />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
