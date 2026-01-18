import api from "./axios";
import { SubjectDto, CreateEditSubjectDto } from "@/types/api/subjects";

export const getSubjects = async (): Promise<SubjectDto[]> => {
  const { data } = await api.get("/Subjects");
  return data;
};

export const getSubject = async (id: string): Promise<SubjectDto> => {
  const { data } = await api.get(`/Subjects/${id}`);
  return data;
};

export const createSubject = async (subject: CreateEditSubjectDto): Promise<SubjectDto> => {
  const { data } = await api.post("/Subjects", subject);
  return data;
};

export const updateSubject = async (subject: {id: string, subject: CreateEditSubjectDto}): Promise<SubjectDto> => {
  const { data } = await api.put(`/Subjects/${subject.id}`, subject.subject);
  return data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/Subjects/${id}`);
};
