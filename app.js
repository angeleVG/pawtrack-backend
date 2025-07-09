// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const petRoutes = require("./routes/pet.routes");
app.use("/api/pet", petRoutes);

const taskRoutes = require("./routes/task.routes");
app.use("/api/task", taskRoutes);

const medicationRoutes = require("./routes/medication.routes");
app.use("/api/medications", medicationRoutes);

const weightRoutes = require("./routes/weight.routes");
app.use("/api/weight", weightRoutes);

const foodRoutes = require("./routes/food.routes");
app.use("/api/food", foodRoutes);

const vaccinationRoutes = require('./routes/vaccination');
app.use('/api/vaccination', vaccinationRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
