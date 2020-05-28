const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const jwtSecret = require("config").get("jwtSecret");

const User = require("../models/User");

// @route     GET api/v1/users
// @desc      Register new user
// @access    Public
router.post(
  "/",
  [
    check("name", "Please enter the username").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // express-validator, to check the conditions given in middleware
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    //  checking if the email is already exist
    const user = await User.find({ email });

    if (user.length) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Creating new user object and save it in mongoDB
    try {
      newUser = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      // creating JWT token for the user
      const payload = {
        user: {
          id: newUser.id,
        },
      };
      const jwtOptoins = { expiresIn: 3600 };
      const token = await jwt.sign(payload, jwtSecret, jwtOptoins);

      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error...");
    }
  }
);

module.exports = router;
