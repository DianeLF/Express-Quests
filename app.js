require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const movieHandlers = require("./movieHandlers");
const { validateMovie } = require("./validators.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", validateMovie, movieHandlers.addMovie);

const userHandlers = require("./userHandlers");
const { validateUser } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, validateUser, userHandlers.addUser);
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);

app.use(verifyToken);
app.put("/api/movies/:id", validateMovie, movieHandlers.modifyMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put("/api/users/:id", hashPassword, validateUser, userHandlers.modifyUser);
app.delete("/api/users/:id", userHandlers.deleteUser);
