const {
  getChapters,
  getAllQuestions,
  getQuestion,
  Constants,
} = require("../utils/functions");

const { getCompletedChaps, setCompletedChaps } = require("../utils/data-store");
const axios = require("axios");

async function handleDiscordInteraction(req, res) {
  const body = req.body;

  const token = body.token;

  if (body?.data?.name === "question") {
    const cmd = body.data.options[0];

    res.json({
      type: 4,
      data: {
        content: `Loading... (Debug token: \`${token}\`)`,
      },
    });

    let subject;
    if (cmd.name === "random") {
      subject = ["physics", "chemistry", "maths"][
        Math.floor(Math.random() * 3)
      ];
    } else {
      subject = cmd.name;
    }
    let chapter;
    if (cmd.options && cmd.options[0] && cmd.options[0].value) {
      chapter = cmd.options[0].value;
    } else {
      const allChaps = (await getCompletedChaps())[subject];
      chapter = allChaps[Math.floor(Math.random() * allChaps.length)];
    }
    const chapterInfo = await getChapters(
      Constants.CLASS_XI,
      Constants[subject.toUpperCase()]
    );

    const questions = await getAllQuestions([chapter]);
    const questionMD =
      questions.questions[
        Math.floor(Math.random() * questions.questions.length)
      ];
    const qid = questionMD.QuestionId;
    const question = await getQuestion(qid);

    const subjectCap = subject.charAt(0).toUpperCase() + subject.slice(1);
    const payload = {
      content: `\`${qid}\``,
      embeds: [
        {
          title: `Question of the Day`,
          description: `**Topic:** ${subjectCap} - ${
            chapterInfo.find((c) => c.courseChapterId === chapter).chapterName
          }
Answer: ||${question.questionData.answerOption}||`,
          image: {
            url: question.questionData.questionDiagramURL,
          },
        },
      ],
    };
    const url = `https://discord.com/api/webhooks/${body.application_id}/${token}/messages/@original`;
    await axios.patch(url, payload);
  } else {
    res.json({
      type: 4,
      data: {
        content: `Loading...
      
      \`\`\`${JSON.stringify(body, null, 2)}\`\`\``,
      },
    });
  }
}

module.exports = handleDiscordInteraction;
