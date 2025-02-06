import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Form, Button, FormControl} from "react-bootstrap";
import array from "./array";
import {v4 as uuid} from "uuid";



const Create = () => {
 

  const addButton = document.querySelector("#add-Button");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const history = useNavigate();

  const handleClickSubmitEvent = (e) => { //e stands for event, which we will call in the onClick
    console.log('add click detected')
    

    e.preventDefault(); //prevents reloading as a default



    const ids = uuid(); //idk what this does, tutorial says it makes a unique id
    let uni = ids.slice(0,8); //slices (copies) the indexed numbers

    // now we need to get the value that is inside usestate and push that to the JS object

    let a = name,
        b = age;
      
    //make sure /check if usestate is empty

    if (name === "" || age === ""){
      return ("Invalid input, or empty");
    }
    //this pushes the new shit to the array
    array.push({ id: uni, Name: a, Age: b});
    console.log("push complete");

    //return back to homepage after successful push
    history("/..");
  }



    return(
<>
        <div className="crud-wrapper" style={{display: "flex", flexDirection:"column"}}>
            <h2>Create new user!</h2>
        <div className="crud-input-wrapper" style={{width:"100%", height:"100%", padding:"1rem", display:"flex", gap:".5rem", alignItems:"center", justifyContent:"center"}}>
        <Form className="d-grid gap-2" style={{width:"100%", height:"100%", padding:"1rem", display:"flex", gap:".5rem", alignItems:"center", justifyContent:"center"}}>
          <Form.Group>
            <FormControl onChange={(e)=> {
              setName(e.target.value)
            }}
            type="text"
            placeholder="Enter name"
            required
            />
          </Form.Group>
        <input type="number" name="ageInput" id="ageInput" placeholder='Age' style={{textAlign:"center",  height: "2.25rem"}} />
        <select name="typeInput" id="typeInput" placeholder="Type" style={{ height: "2.25rem", textAlign:"center"}}>
          <option value="Humanoid">Humanoid</option>
          <option value="Kanine">Kanine</option>
          <option value="other">Other</option>
        </select>
        <Button id="add-Button" onClick={(e)=>{handleClickSubmitEvent(e)}} variant="primary" style={{position:"relative"}}>Add</Button>
       </Form>
        </div>
      </div>
        <Link to="/.."><Button variant="danger" style={{margin: "1rem", width:"30%"}}>Cancel </Button></Link>


</>
    )
    
}

export default Create;