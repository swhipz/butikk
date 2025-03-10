import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import array from "./array";
import { Link, useNavigate } from "react-router-dom";

const Edit = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState("");
  const [type, setType] = useState("");

  let history = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem("Name"));
    setAge(localStorage.getItem("Age"));
    setType(localStorage.getItem("Type"));
    setId(localStorage.getItem("Id"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === "" || age === "" || type === "") {
      alert("Invalid input, or empty");
      return;
    }

    let i = array
      .map(function (e) {
        return e.id;
      })
      .indexOf(id);

    if (i === -1) {
      alert("Item not found!");
      return;
    }

    let a = array[i];

    a.Name = name;
    a.Age = age;
    a.Type = type;

    localStorage.setItem("array", JSON.stringify(array));

    history("/");
  };

  return (
    <>
      <Form className="d-grid gap2" id="updateID">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "flex", textAlign: "center" }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
            }}
            type="number"
            min="0"
            style={{ display: "flex", textAlign: "center" }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicSelect">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ textAlign: "center" }}
          >
            <option value="Humanoid">Humanoid</option>
            <option value="Canine">Canine</option>
            <option value="Feline">Feline</option>
            <option value="other">Other</option> {/**other */}
          </select>
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        type="submit"
        size="lg"
        className="btn"
        style={{ marginTop: "2vh", fontWeight: "600" }}
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        Update
      </Button>
      <Link to="/" style={{ marginTop: "5vh" }}>
        <Button variant="warning">Home</Button>
      </Link>
    </>
  );
};

export default Edit;
