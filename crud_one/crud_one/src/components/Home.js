import React from "react";
import { Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import array from "./array";
import { Link, useNavigate } from "react-router-dom";

const emptyArray = [];

const Home = () => {

    
   // let history = useNavigate();
  

    function setID(id, name, age, type) {
        localStorage.setItem("id", id);
        localStorage.setItem("Name", name);
        localStorage.setItem("Age", age);
        localStorage.setItem("Type", type);
    }
    const deleteID = (id) => {
        let i = emptyArray.map(function(e){return e.id}).indexOf(id);
        emptyArray.splice(i, 1);

       window.location.reload();

    }

    return(
        <>
        <div className="h2-home" style={{fontWeight: "900"}}>Homepage</div>
        <Table striped bordered hover responsive className="shadow-sm">
        <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Type</th>
                        <th>Actions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {array.map((item,index) => {
                        return(
                            <tr key={index}>
                                <td>{item.Name}</td>
                                <td>{item.Age}</td>
                                <td>{item.Type}</td>
                                <Button className="me-2" variant="info">Edit NF</Button>
                                <Button className="me-2" variant="danger"
                                
                                onClick={() => {deleteID(item.id)}}
                                >Remove</Button>

                            </tr>
                            
                        )
                    })}
                </tbody>
        </Table>

        </>
    )

}
export default Home;