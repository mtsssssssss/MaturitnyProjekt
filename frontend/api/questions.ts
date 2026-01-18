import api from "./axios";
import { CreateEditQuestionDto, QuestionResponseDto } from "@/types/api/questions";

export const getQuestions = async (): Promise<QuestionResponseDto[]> => {
  const { data } = await api.get("/Questions");
  return data;
};

export const getQuestion = async (id: string): Promise<QuestionResponseDto> => {
  const { data } = await api.get(`/Questions/${id}`);
  return data;
};

export const createQuestion = async (question: CreateEditQuestionDto): Promise<QuestionResponseDto> => {
  const { data } = await api.post("/Questions", question);
  return data;
};

export const updateQuestion = async (id: string, question: CreateEditQuestionDto): Promise<QuestionResponseDto> => {
  const { data } = await api.put(`/Questions/${id}`, question);
  return data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/Questions/${id}`);
};
