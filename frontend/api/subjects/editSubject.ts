import api from "@/api/axios";
import { CreateSubject } from "@/types/subject";


export const editSubject = async ({ id, data }: { id: string, data: CreateSubject }) => {
    const response = await api.put(`/Subjects/${id}`, JSON.stringify(data));
    return response.data;
}
