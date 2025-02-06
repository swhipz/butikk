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
      <div className="h2-home" style={{ fontWeight: "600", fontSize: "2rem" }}>
        Homepage
      </div>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="thead-dark">
          <tr>
            <th>id</th>
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
                <Link to={`/edit`}>
                  <Button
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
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Link to="/create">
        <Button style={{ width: "100%" }}>Create new user</Button>
      </Link>
    </>
  );
};
export default Home;
