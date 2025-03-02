import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, FormControl } from "react-bootstrap";
import array from "./array";
import { v4 as uuid } from "uuid";

const Create = () => {
  const addButton = document.querySelector("#add-Button");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("Humanoid");

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === "" || age === "" || type === "") {
      alert("Invalid input, or empty");
      return;
    }

    const newId = String(array.length + 1);

    const newItem = {
      id: newId,
      Name: name,
      Age: age,
      Type: type,
    };

    array.push(newItem);

    // Save to localStorage after adding new item
    localStorage.setItem("array", JSON.stringify(array));

    history("/");
  };

  return (
    <>
      <div
        className="crud-wrapper"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h2 style={{fontFamily:"Bangers"}}>Create new user!</h2>
        <div
          className="crud-input-wrapper"
          style={{
            width: "100%",
            height: "100%",
            padding: "1rem",
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form
            className="d-grid gap-2"
            style={{
              width: "100%",
              height: "100%",
              padding: "1rem",
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form.Group className="mb-3">
              <FormControl
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                placeholder="Enter name"
                required
                style={{ height: "2.25rem", textAlign: "center" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                style={{ height: "2.25rem", textAlign: "center" }}
                type="number"
                required
                placeholder="Age"
                min={0}
              />
            </Form.Group>
            <Form.Group>
              <select
                className="form-select"
                onChange={(e) => {
                  setType(e.target.value);
                }}
                name="typeInput"
                id="typeInput"
                placeholder="Type"
                style={{ height: "2.25rem", textAlign: "center" }}
              >
                <option value="Humanoid">Humanoid</option>
                <option value="Canine">Canine</option>
                <option value="Feline">Feline</option>
                <option value="other">Other</option>
              </select>
            </Form.Group>
            <Button
              id="add-Button"
              onClick={(e) => {
                handleSubmit(e);
              }}
              variant="primary"
              style={{ position: "relative",fontFamily:"Bangers", letterSpacing:"2px" }}
            >
              Add
            </Button>
          </Form>
        </div>
      </div>
      <Link to="/">
        <Button variant="danger" style={{ margin: "1rem", width: "30%", fontFamily:"Bangers", letterSpacing:"3px"}}>
          Cancel
        </Button>
      </Link>
    </>
  );
};

export default Create;
