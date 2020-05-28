const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middleware/checkAuth");
const { check, validationResult } = require("express-validator");

const jwtSecret = require("config").get("jwtSecret");

// @route     GET api/v1/auth
// @desc      Get logged in user
// @access    Private
router.get("/", checkAuth, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
});

// @route     POST api/v1/auth
// @desc      Authenticate user and get token
// @access    Private
router.post(
  "/",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password missing").not().isEmpty(),
  ],
  async (req, res) => {
    // Checking for basic validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if user is available
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "User not registered" });
      }

      // If available then compare the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ msg: "Email or Password is wrong" });
      }

      // if password is correct then construct jwt token
      const payload = {
        user: { id: user.id },
      };
      const jwtOption = { expiresIn: 3600 };
      const token = await jwt.sign(payload, jwtSecret, jwtOption);

      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
