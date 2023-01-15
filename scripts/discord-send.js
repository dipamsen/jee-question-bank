const { getCompletedChaps } = require("../utils/data-store");
const {
  getChapters,
  getAllQuestions,
  getQuestion,
  Constants,
} = require("../utils/functions");

const url = "https://fp-discord-pinger-test.vercel.app/sendmessage";

async function sendRandomQuestion(subject) {
  const chapters = (await getCompletedChaps())[subject];
  const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
  const questions = await getAllQuestions([randomChapter]);

  const questionMD =
    questions.questions[Math.floor(Math.random() * questions.questions.length)];

  const qid = questionMD.QuestionId;
  const question = await getQuestion(qid);

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `QoD (${subject.toUpperCase()}: ${
        questionMD.chapterName
      }) (\`${qid}\`)`,
    }),
  });
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: question.questionData.questionDiagramURL,
    }),
  });
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `||Answer: (${question.questionData.answerOption})||`,
    }),
  });
}

module.exports = sendRandomQuestion;
