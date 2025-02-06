import logo from './logo.svg';
import './App.css';
import array from './components/array';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Home"


// https://www.geeksforgeeks.org/how-to-do-crud-operations-in-reactjs/
function App() {
  return (
    <div className="App">
      <h1></h1>
      <div className="crud-input-wrapper">
        <input type="text" name="nameInput" id="nameInput" placeholder='Enter your name' style={{width: "10rem", textAlign:"center"}}/>
        <input type="number" name="ageInput" id="ageInput" placeholder='Age' style={{width: "5rem", textAlign:"center"}}/>
        <select name="typeInput" id="typeInput" placeholder="Type" style={{height: "1.875rem"}}>
          <option value="Humanoid">Humanoid</option>
          <option value="Kanine">Kanine</option>
          <option value="other">Other</option>
        </select>

        <button onClick="" >Add</button>
      </div>
      <div className="crud-output-wrapper" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        <div className="content-display" style={{display:"flex", flexDirection:"column", width: "50vw"}}>
          <Home />
        

        </div>
      </div>
    </div>
  );
}

export default App;
