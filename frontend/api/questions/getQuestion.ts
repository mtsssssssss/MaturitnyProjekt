import api from "@/api/axios";
import { Question } from "@/types/question";


export const getQuestion = async (id: string): Promise<Question> => {
    const response = await api.get(`/Questions/${id}`);
    return response.data;
}
