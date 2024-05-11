const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
//Route 1 to get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Request failed");
  }
});
//Route 2 to add a note
router.post(
  "/addnote",
  fetchuser,
  [
    body("description", "ENter  a valid description").isLength({ min: 5 }),
    body("title", "Enter a valid title").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Request failed");
    }
  }
);
//Route 3 to update an existing note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create a new note
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //Find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Access Denied");
  }
  note=await  Notes.findByIdAndUpdate(req.params.id, {$set: newNote},{new: true});
  res.json({note});
});
//Route 4 to delete an existing note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {  
  const { title, description, tag } = req.body;
  //Find the note to be deleted and delete it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  //Allow deletion if only user owns the note
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Access Denied");
  }
  note=await  Notes.findByIdAndDelete(req.params.id);
 res.json({"Success":"Note has been deleted"});
});
module.exports = router;
