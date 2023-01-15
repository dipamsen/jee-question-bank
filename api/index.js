const express = require("express");
const cors = require("cors");

const {
  getChapters,
  getAllQuestions,
  getQuestion,
  Constants,
} = require("../utils/functions");
const { getCompletedChaps, setCompletedChaps } = require("../utils/data-store");
const sendRandomQuestion = require("../scripts/discord-send");
const { verifyKeyMiddleware } = require("discord-interactions");
const app = express();

app.post(
  "/dc-interact",
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  async (req, res) => {
    const body = req.body;

    const token = body.token;

    if (body.data.name === "question") {
      const cmd = body.data.options[0];

      res.json({
        type: 4,
        data: {
          content: `Loading...
      
      \`\`\`${JSON.stringify(body, null, 2)}\`\`\``,
        },
      });

      try {
        let subject;
        if (cmd.name === "random") {
          subject = ["physics", "chemistry", "maths"][
            Math.floor(Math.random() * 3)
          ];
        } else {
          subject = cmd.name;
        }
        console.log(subject);
        let chapter;
        if (cmd.options && cmd.options[0] && cmd.options[0].value) {
          chapter = cmd.options[0].value;
        } else {
          const allChaps = await getChapters(11, subject);
          chapter = allChaps[Math.floor(Math.random() * allChaps.length)];
        }
        console.log(chapter);
        const questions = await getAllQuestions([chapter]);
        const questionMD =
          questions.questions[
            Math.floor(Math.random() * questions.questions.length)
          ];
        console.log(question);
        console.log(token);
        const qid = questionMD.QuestionId;
        const question = await getQuestion(qid);
        const payload = {
          embeds: [
            {
              title: `Question of the Day - ${subject}`,
              image: {
                url: question.questionImage,
              },
            },
          ],
        };
        await fetch(
          `https://discord.com/api/webhooks/${body.application_id}/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        await fetch(`https://fp-discord-pinger-test.vercel.app/sendmessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.error(e);
        await fetch(`https://fp-discord-pinger-test.vercel.app/sendmessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `Error: ${e.message}`,
          }),
        });
      }
    }
  }
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

app.get("/chapter-info", async (req, res) => {
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
  });
});

app.get("/questions", async (req, res) => {
  // ?chapter=1
  const { chapter } = req.query;
  if (!chapter) {
    res.status(400).send({ error: "Invalid chapter" });
    return;
  }
  const questions = await getAllQuestions([chapter]);
  res.json(questions.questions);
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
