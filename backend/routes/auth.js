const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "BhargeshJani";
var fetchuser = require("../middleware/fetchUser");
//Creat a user using :POST "/api/auth/" . Doesent require authentication
router.post(
  "/createUser",
  body("password").isLength({ min: 5 }),
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check if the user exists in the database
    let user = await User.findOne({ email: req.body.email });
    try {
      if (user) {
        return res.status(400).json({ success,error: "This user already exists" });
      }
      //Create a new user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //  .then(user => res.json(user)).catch(err => {console.log(err); res.json({error : 'Please enter a unique value'})})
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Request failed");
    }
  }
);
//Authenticate a user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user=await User.findOne({ email});
        if(!user)
        {
          success=false
          return res.status(400).json({ success,errors: "Invalid credentials" });
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
          success=false
          return res.status(400).json({ success,errors: "Invalid credentials" });
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Request failed");
    }
  }
);

//Route 3 Get logged in using the current user//login required
router.post(
  "/getuser",fetchuser, 
  async (req, res) => {
try {
   userId= req.user.id;   
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
      res.status(500).send("Request failed");
}
  });
module.exports = router;
