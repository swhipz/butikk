import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import { Link, Route, BrowserRouter } from 'react-router';
import Home from './pages/home/Home';


function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;
