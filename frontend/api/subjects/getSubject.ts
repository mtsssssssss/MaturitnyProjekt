import api from "@/api/axios";
import { Subject } from "@/types/subject";


export const getSubject = async (id: string): Promise<Subject> => {
    const response = await api.get(`/Subjects/${id}`);
    return response.data;
}
