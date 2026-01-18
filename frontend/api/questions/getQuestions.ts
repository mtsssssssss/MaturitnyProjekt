import api from "@/api/axios";
import { Question } from "@/types/question";


export const getQuestions = async (): Promise<Question[]> => {
    const response = await api.get("/Questions");
    return response.data;
}
