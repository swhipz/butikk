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
      <h1 style={{fontSize:"128px"}}>CRUD #1</h1>

      <div className="crud-output-wrapper" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        <div className="content-display" style={{display:"flex", flexDirection:"column"}}>
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
