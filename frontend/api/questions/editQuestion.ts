import api from "@/api/axios";
import { CreateQuestion } from "@/types/create-question";


export const editQuestion = async ({ id, data }: { id: string, data: CreateQuestion }) => {
    const response = await api.put(`/Questions/${id}`, JSON.stringify(data));
    return response.data;
}
