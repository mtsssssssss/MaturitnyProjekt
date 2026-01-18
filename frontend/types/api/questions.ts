export interface AbcdAnswerResponseDto {
  id: string;
  answer: string;
  isRight: boolean;
}

export interface CreateEditAbcdAnswerDto {
  answer: string;
  isRight: boolean;
}

export interface CreateEditQuestionDto {
  questionText: string;
  subjectId: string;
  questionType: number;
  abcdAnswers?: CreateEditAbcdAnswerDto[];
  answer?: string;
}

export interface QuestionResponseDto {
  id: string;
  questionText: string;
  subjectId: string;
  questionType: number;
  abcdAnswers?: AbcdAnswerResponseDto[];
  answer?: string;
}
