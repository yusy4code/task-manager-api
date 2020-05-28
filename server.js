const express = require("express");
const app = express();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ extended: false }));

app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/tasks", require("./routes/tasks"));

app.get("/", (req, res) => {
  res.send("Lets start");
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
