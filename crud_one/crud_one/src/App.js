import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import "./App.css";
import Create from "./components/Create";
import Edit from "./components/Edit";
import Home from "./components/Home";



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
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit" element={<Edit />} />
            </Routes>
          </Router>

        </div>
      </div>
    </div>
  );
}

export default App;
