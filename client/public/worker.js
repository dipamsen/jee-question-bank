onmessage = (e) => {
  let {
    questions,
    selectedDifficulty,
    selectedQuestionType,
    selectedKSCCluster,
  } = e.data;
  questions = JSON.parse(questions);
  selectedDifficulty = JSON.parse(selectedDifficulty);
  selectedQuestionType = JSON.parse(selectedQuestionType);
  selectedKSCCluster = JSON.parse(selectedKSCCluster);

  if (
    selectedDifficulty.length === 0 &&
    selectedQuestionType.length === 0 &&
    selectedKSCCluster.length === 0
  ) {
    return postMessage(questions);
  }
  const output = questions.filter((q) => {
    if (selectedDifficulty.length > 0) {
      if (!selectedDifficulty.includes(q.DifficultyGroup)) {
        return false;
      }
    }
    if (selectedQuestionType.length > 0) {
      if (!selectedQuestionType.includes(q.QuestionType)) {
        return false;
      }
    }
    if (selectedKSCCluster.length > 0) {
      if (!selectedKSCCluster.includes(q.kscClusterName)) {
        return false;
      }
    }
    return true;
  });
  postMessage(output);
};
