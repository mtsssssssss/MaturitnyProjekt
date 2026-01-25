import { Subject } from "./subjects";

export interface AbcdAnswerResponse {
  id: string;
  answer: string;
  isRight: boolean;
}

export interface CreateEditAbcdAnswer {
  answer: string;
  isRight: boolean;
}

export interface CreateEditQuestion {
  questionText: string;
  subjectId: string;
  questionType: number;
  abcdAnswers?: CreateEditAbcdAnswer[];
  answer?: string;
}

export interface QuestionResponse{
  id: string;
  questionText: string;
  subject: Subject;
  questionType: string;
  abcdAnswers?: AbcdAnswerResponse[];
  answer?: string;
}
