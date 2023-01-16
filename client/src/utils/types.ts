export interface Chapter {
  chapterId: number;
  courseChapterId: number;
  chapterName: string;
}

export interface ChapterInfo {
  numQuestions: number;
  uniqueQuestions: number;
  kscClusterNames: {
    KSCClusterId: number;
    KSCClusterName: string;
  }[];
  chapter: {
    CourseChapterId: number;
    ChapterName: string;
  };
  questions: {
    CourseChapterId: number;
    KSCClusterId: number;
    KSCId: number;
    QuestionId: number;
    QuestionDiagramURL: `~/dataimages/questionImages/${string}`;
    QuestionType: "Objective" | "Multiple Choice" | "Numerical";
    Accuracy: `${number}%`;
    AvgTimeSecs: number;
    AvgTime: string;
    RelativeDifficulty: number;
    DifficultyGroup: "Basic" | "Easy" | "Normal" | "Hard" | "Tough";
    QuestionStatus: "New";
    QuestionGroup: number;
    GroupStart: number;
    chapterName: string;
    kscClusterName: string;
  }[];
}
