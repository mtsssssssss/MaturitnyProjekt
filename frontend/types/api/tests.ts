export type TestCreate = {
  time: number;
  subjectId: string;
};

export type ManualTestCreate = {
  testName: string;
  testDescription: string;
  timeLimitMinutes: number;
  subjectId: string;
  questionIds: string[];
  assignedUserIds: string[];
};

export type StartTestRequest = {
  testId: string;
};

export type StartTestResponse = {
  id: string;
  testAttemptId: string;
  testName: string;
  testDescription: string;
  timeLimitMinutes: number;
  questions: {
    id: string;
    questionText: string;
    type: string;
    answers?: { id: string; answer: string }[];
  }[];
};

export type SubmitAnswerRequest = {
  testAttemptId: string;
  questionId: string;
  selectedAbcdAnswerId?: string;
  writtenAnswer?: string;
};

export type FinishTestRequest = {
  testAttemptId: string;
};

export type FinishTestResponse = {
  testAttemptId: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScorePercentage: number;
  testFinished: string;
};

export type AssignedTestListItem = {
  testId: string;
  testName: string;
  testDescription: string;
  timeLimitMinutes: number;
  assignedAt: string;
};

export type AttemptResultListItem = {
  testAttemptId: string;
  testId: string;
  testName: string;
  testStarted?: string | null;
  testFinished?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  totalScorePercentage: number;
};

export type StudentAttemptResultListItem = AttemptResultListItem & {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
};