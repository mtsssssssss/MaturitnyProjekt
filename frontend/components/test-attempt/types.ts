import type { StartTestResponse, FinishTestResponse } from "@/types/api/tests";

export type QuestionAnswer = {
  questionId: string;
  selectedAbcdAnswerId?: string;
  writtenAnswer?: string;
};

export type AttemptQuestion = StartTestResponse["questions"][number];

export type { StartTestResponse, FinishTestResponse };
