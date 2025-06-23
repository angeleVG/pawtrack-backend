const router = require("express").Router();
const Task = require("../models/Task.model");

// CREATE task
router.post("/", (req, res, next) => {
  Task.create(req.body)
    .then((task) => res.status(201).json(task))
    .catch((error) => {
      next(error);
    });
});

// READ all tasks
router.get("/", (req, res, next) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((error) => {
      next(error);
    });
});

// READ one task by ID
router.get("/:taskId", (req, res, next) => {
  Task.findById(req.params.taskId)
    .then((task) =>
      task
        ? res.json(task)
        : res.status(404).json({ error: "Task not found" })
    )
    .catch((error) => {
      next(error);
    });
});

// UPDATE task
router.put("/:taskId", (req, res, next) => {
  Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
    .then((updated) => res.json(updated))
    .catch((error) => {
      next(error);
    });
});

// DELETE task
router.delete("/:taskId", (req, res, next) => {
  Task.findByIdAndDelete(req.params.taskId)
    .then(() => res.status(204).send())
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
