import React from "react";
import { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
import { useState } from "react";
const AddNote = () => {
    const context=useContext(noteContext);
    const {addNote}=context;
    const [note, setNote] = useState({title: "", description:"",tag:"personal"})
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description,note.tag);
        setNote({title: "", description:"",tag:"default"});
    }
    const onChange = (e) => {
        setNote({...note,[e.target.name]: e.target.value})
    } 
  return (
    <div>
      <h1>Add a Note</h1>
      <div className="container">
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={note.title}
              aria-describedby="emailHelp"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={note.description}
              name="description"
              onChange={onChange}
              
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={note.tag}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" onClick={handleClick}>
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
