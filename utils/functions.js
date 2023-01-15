const axios = require("axios").default;
require("dotenv").config();

const token = process.env.BEARER_TOKEN;

const PHYSICS = 1;
const CHEMISTRY = 3;
const MATHS = 2;

const CLASS_XI = 9;
const CLASS_XII = 10;

const USER_ID = 180343;
const USER_ID_SPOOF = 2;

const labs = axios.create({
  headers: {
    Authorization: "Bearer " + token,
  },
});

async function getChapters(cls, subject) {
  const url =
    "https://mobileapi.speedlabs.in/api/dashboard/student_coverage_data";
  const { data } = await labs.get(url, {
    params: {
      userId: USER_ID,
      courseId: 1,
      classId: cls,
      subjectId: subject,
      isPractice: 1,
    },
  });
  return data.data.chapterWiseCards.cards
    .map(({ chapterId, courseChapterId, chapterName }) => ({
      chapterId,
      courseChapterId,
      chapterName,
    }))
    .sort((a, b) => a.courseChapterId - b.courseChapterId);
}

async function getAllQuestions(chapters) {
  const url =
    "https://mobileapi.speedlabs.in/api/practice/questions/" + USER_ID_SPOOF;
  const { data: lvl1 } = await labs.post(url, {
    courseChapterIds: chapters.join(),
    questionTypeIds: "1,2,3,4,5,6",
    questionLevelIds: 1,
  });
  const { data: lvl2 } = await labs.post(url, {
    courseChapterIds: chapters.join(),
    questionTypeIds: "1,2,3,4,5,6",
    questionLevelIds: 2,
  });

  return {
    questions: lvl1.data.questionsList
      .flat()
      .concat(lvl2.data.questionsList.flat()),
    kscClusterNames: lvl1.data.kscClusterNames,
    chapterNames: lvl1.data.chapterNames,
  };
}

async function getQuestion(id) {
  const url =
    "https://mobileapi.speedlabs.in/api/practice/userTest-session/get-nextQuestion";
  const { data } = await labs.post(url, {
    userTestSessionId: 1659850,
    questionId: id,
    courseId: 1,
    userId: USER_ID_SPOOF,
    serverToken: token,
  });
  return data.data;
}
module.exports = {
  getChapters,
  getAllQuestions,
  getQuestion,

  Constants: {
    PHYSICS,
    CHEMISTRY,
    MATHS,

    CLASS_XI,
    CLASS_XII,

    USER_ID,
    USER_ID_SPOOF,
  },
};
