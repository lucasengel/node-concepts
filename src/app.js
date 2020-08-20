const express = require("express");
const { v4: uuid } = require("uuid");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const findRepoIndex = (id) => repositories.findIndex((repo) => repo.id === id);

const findRepoMiddleware = (request, response, next) => {
  const { id } = request.params;

  if (findRepoIndex(id) < 0)
    return response.status(400).json({ error: "Repository not found" });

  next();
};

app.use("/repositories/:id", findRepoMiddleware);

const repositories = [];

/**
 * GET
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * POST
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.json(newRepo);
});

/**
 * UPDATE
 */
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = findRepoIndex(id);

  const updates = {
    title,
    url,
    techs,
  };

  const updatedRepo = {
    ...repositories[repoIndex],
    ...updates,
  };

  repositories[repoIndex] = updatedRepo;

  response.json(updatedRepo);
});

/**
 * DELETE
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = findRepoIndex(id);
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

/**
 * LIKE
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = findRepoIndex(id);
  repositories[repoIndex].likes++;
  return response.json(repositories[repoIndex]);
});

module.exports = app;
