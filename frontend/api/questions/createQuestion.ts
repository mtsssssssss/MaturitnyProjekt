import api from "@/api/axios";
import { CreateQuestion } from "@/types/create-question";


export const postQuestion = async (data: CreateQuestion) => {
    const response = await api.post("/Questions", JSON.stringify(data));
    return response.data;
}
