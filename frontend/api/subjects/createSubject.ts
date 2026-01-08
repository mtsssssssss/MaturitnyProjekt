import api from "@/api/axios";
import { CreateSubject } from "@/types/subject";


export const postSubject = async (data: CreateSubject) => {
    const response = await api.post("/Subjects", JSON.stringify(data));
    return response.data;
}
