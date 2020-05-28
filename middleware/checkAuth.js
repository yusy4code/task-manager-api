const express = require("express");
const jwt = require("jsonwebtoken");
const jwtSecret = require("config").get("jwtSecret");

const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: "Not Authorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = checkAuth;
