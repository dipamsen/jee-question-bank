async function getStatus(id) {
  const url = "https://mobileapi.speedlabs.in/api/practice/questions/" + id;
  const params = {
    courseChapterIds: "53", //isomerism
    questionTypeIds: "1,2,3,4,5,6",
    questionLevelIds: 1,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.BEARER_TOKEN,
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  return data.data.subjectDetails.userSubject.Expertise;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  for (let num = 180300; num < 200000; num++) {
    const status = await getStatus(num);
    console.log(num, status);
    if (status !== "Novice") {
      console.log("==============================");
    }
    await wait(500);
  }
}
main();
