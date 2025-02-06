import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
const Create = () => {

    return(
<>
        <div className="crud-wrapper" style={{display: "flex", flexDirection:"column"}}>
            <h2>Create new user!</h2>
        <div className="crud-input-wrapper" style={{width:"100%", height:"100%", padding:"1rem", display:"flex", gap:".5rem"}}>
        <input type="text" name="nameInput" id="nameInput" placeholder='Enter your name' style={{textAlign:"center", margin:"0", height: "2.25rem"}}/>

        <input type="number" name="ageInput" id="ageInput" placeholder='Age' style={{textAlign:"center",  height: "2.25rem"}}/>
        <select name="typeInput" id="typeInput" placeholder="Type" style={{ height: "2.25rem"}}>
          <option value="Humanoid">Humanoid</option>
          <option value="Kanine">Kanine</option>
          <option value="other">Other</option>
        </select>

        <Button onClick={()=>{console.log('balls')}} variant="outline-primary" style={{position:"relative"}}>Add</Button>
        </div>
      </div>
        <Link to="/.."><Button style={{margin: "1rem", width:"100%"}}>Back to overview</Button></Link>
</>
    )
    
}

export default Create;