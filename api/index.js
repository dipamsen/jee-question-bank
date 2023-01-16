const express = require("express");
const cors = require("cors");

const {
  getChapters,
  getAllQuestions,
  getQuestion,
  Constants,
} = require("../utils/functions");

const axios = require("axios");
const { getCompletedChaps, setCompletedChaps } = require("../utils/data-store");
const sendRandomQuestion = require("../scripts/discord-send");
const handleDiscordInteraction = require("../scripts/discord-interaction");
const { verifyKeyMiddleware } = require("discord-interactions");
const app = express();

app.post(
  "/dc-interact",
  // express.json(),
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  handleDiscordInteraction
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SpeedLabs API");
});

app.get("/chapters", async (req, res) => {
  // ?grade=11&subject=physics
  const { grade, subject } = req.query;
  if (
    !grade ||
    !subject ||
    !Constants[subject.toUpperCase()] ||
    ![11, 12].includes(+grade)
  ) {
    res.status(400).send({ error: "Invalid grade or subject" });
    return;
  }
  const chapters = await getChapters(
    +grade - 2,
    Constants[subject.toUpperCase()]
  );
  res.json(chapters);
});

app.get("/questions", async (req, res) => {
  // ?chapter=1
  const { chapter } = req.query;
  if (!chapter) {
    res.status(400).send({ error: "Invalid chapter" });
    return;
  }
  const questions = await getAllQuestions([chapter]);
  res.json({
    numQuestions: questions.questions.length,
    uniqueQuestions: new Set(questions.questions.map((q) => q.QuestionId)).size,
    kscClusterNames: questions.kscClusterNames,
    chapter: questions.chapterNames[0],
    questions: questions.questions,
  });
});

app.get("/question", async (req, res) => {
  // ?id=1
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ error: "Invalid question id" });
    return;
  }
  const question = await getQuestion(id);
  res.json(question);
});

app.get("/comp-status", async (req, res) => {
  res.json(await getCompletedChaps());
});

app.post("/comp-status", async (req, res) => {
  const { completedChaps } = req.body;
  if (
    !completedChaps ||
    !completedChaps.physics ||
    !completedChaps.chemistry ||
    !completedChaps.maths
  ) {
    res.status(400).send({ error: "Invalid request" });
    return;
  }
  await setCompletedChaps(completedChaps);
  res.json({ success: true });
});

app.get("/discord-qod/:subject", async (req, res) => {
  let { subject } = req.params;
  if (subject === "random")
    subject = ["physics", "chemistry", "maths"][Math.floor(Math.random() * 3)];

  if (!Constants[subject.toUpperCase()]) {
    res.status(400).send({ error: "Invalid subject" });
    return;
  }

  await sendRandomQuestion(subject);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

module.exports = app;
