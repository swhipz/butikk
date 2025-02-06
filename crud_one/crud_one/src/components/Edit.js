import React, {useEffect, useState } from "react";
import {Button, Form} from "react-bootstrap";
import array from "./array";
import {Link, useNavigate} from "react-router-dom";



const Edit = () => {
  
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("");

  let history = useNavigate();

  let i = array.map(function (e) {
    return e.id;
  }).indexOf(id);


  const handleSubmit = (e) =>  {
    e.preventDefault();

    if (name === "" || age === "" || type === ""){
      alert("Invalid input, or empty");
      return;
    }
    
    let a = array[i];
    a.Name = name;
    a.Age = age;
    a.Type = type;
  
    history("/")
  };

  useEffect(() =>{
    setName(localStorage.getItem("Name"));
    setAge(localStorage.getItem("Age"));
    setType(localStorage.getItem("Type"));
  }, []);

  
  
  
  return(
    <>
    <Form className="d-grid gap2" id="updateID">
      <Form.Group controlId="formBasicEmail">
        <Form.Control value={name} onChange={(e)=>{setName(e.target.value)}} type="text" style={{display:"flex", textAlign:"center"}} />        
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Control value={age} onChange={(e)=>{setAge(e.target.value)}} type="number" min="0" style={{display:"flex", textAlign:"center"}} />        
      </Form.Group>
      <Form.Group controlId="formBasicSelect">
        <select className="form-select" style={{textAlign:"center"}}>
          <option value="Humanoid">Humanoid</option>
          <option value="Kanine">Kanine</option>
          <option value="other">Other</option>
        </select>    
      </Form.Group>
    </Form>
    <Button variant="warning" className="btn" style={{marginTop:"2vh"}} onClick={(e)=>{handleSubmit(e)}}>Update</Button>
    <Link to="/" style={{marginTop:"5vh"}}><Button variant="primary">Home</Button></Link>

    </>
  )
}

export default Edit;