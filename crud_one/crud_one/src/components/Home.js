import React from "react";
import { Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import array from "./array";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  let history = useNavigate();

  function setID(id, name, age, type) {
    localStorage.setItem("Id", id);
    localStorage.setItem("Name", name);
    localStorage.setItem("Age", age);
    localStorage.setItem("Type", type);
  }

  const deleteID = (id) => {
    let i = array
      .map(function (e) {
        return e.id;
      })
      .indexOf(id);
    array.splice(i, 1);

    localStorage.setItem("array", JSON.stringify(array));

    history("/");
  };

  return (
    <>
      <div className="h2-home" style={{ fontWeight: "100", fontSize: "2rem", fontFamily:"Bangers"}}>
        Overview
      </div>
      <div className="tableWrap" style={{display:"block", justifyContent: "space-evenly", alignItems:"stretch"}}>
      <Table striped bordered hover responsive className="shadow-sm" style={{width: "100%"}}>
        <thead className="thead-dark" >
          <tr>
            <th >id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {array.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.Name}</td>
                <td>{item.Age}</td>
                <td>{item.Type}</td>
                <div className="actionButtons" style={{display:"flex", justifyContent:"space-evenly"}}>
                <Link to={`/edit`}>
                  <Button
                    style={{fontFamily:"Bangers", width:"100%", color:"white"}}
                    variant="info"
                    onClick={() => {
                      setID(item.id, item.Name, item.Age, item.Type);
                    }}
                  >
                    Update
                  </Button>
                </Link>
                <Link>
                  <Button
                    style={{fontFamily:"Bangers", width:"100%"}}
                    type="button"
                    className="btn btn-danger"
                    variant="danger"
                    onClick={() => {
                      deleteID(item.id);
                    }}
                  >
                    Remove
                  </Button>
                </Link>
                </div>
              </tr>
              
            );
          })}
        </tbody>
      </Table>
      </div>

      <Link to="/create">
        <Button style={{ width: "100%", fontFamily:"Bangers"}}>Create new user</Button>
      </Link>
    </>
  );
};
export default Home;
