export type TestCreate = {
    time: number, 
    subjectId: string
}

export type StartTestRequest = {
  testId: string;
};

export type StartTestResponse = {
  id: string;
  subjectId: string;
  time: number;
  questions: {
    id: string;
    questionText: string;
    type: number;
    answers?: { id: string; answer: string }[];
  }[];
}[];