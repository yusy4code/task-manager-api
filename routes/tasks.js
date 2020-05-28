const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const checkAuth = require("../middleware/checkAuth");
const Task = require("../models/Tasks");

// @route     GET api/v1/tasks
// @desc      Get list of task of a user
// @access    Private
router.get("/", checkAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await Task.find({ userId });
    return res.json({ tasks: tasks });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server error");
  }
});

// @route     POST api/v1/tasks
// @desc      Updating new task
// @access    Private
router.post(
  "/",
  [checkAuth, [check("taskName", "Task Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const taskName = req.body.taskName;
    const taskDescription = req.body.taskDescription || "";

    const newTask = new Task({
      userId: req.user.id,
      taskName,
      taskDescription,
    });

    try {
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route     PUT api/v1/tasks
// @desc      Update existing task
// @access    Private
router.put("/:id", checkAuth, async (req, res) => {
  const taskid = req.params.id;
  const userId = req.user.id;
  const { taskName, taskDescription, taskStatus } = req.body;

  try {
    let task = await Task.findById(taskid);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.userId.toString() !== userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updatedTask = {};

    if (taskName) updatedTask.taskName = taskName;
    if (taskDescription) updatedTask.taskDescription = taskDescription;
    if (taskStatus) updatedTask.taskStatus = taskStatus;

    task = await Task.findByIdAndUpdate(
      taskid,
      { $set: updatedTask },
      { new: true }
    );
    return res.json(task);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server error");
  }
});

// @route     PUT api/v1/tasks
// @desc      Update existing task
// @access    Private
router.delete("/:id", checkAuth, async (req, res) => {
  const taskid = req.params.id;
  const userId = req.user.id;

  try {
    // check if task exists
    let task = await Task.findById(taskid);

    if (!task) return res.status(404).json({ msg: "Task Not Found" });

    // check if the task belongs to the user
    if (task.userId.toString() !== userId)
      return res.status(401).json({ msg: "Not authorized" });

    // delete the task
    await Task.findByIdAndDelete(taskid);

    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
