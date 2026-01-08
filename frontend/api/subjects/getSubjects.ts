import api from "@/api/axios";
import { Subject } from "@/types/subject";


export const getSubjects = async (): Promise<Subject[]> => {
    const response = await api.get("/Subjects");
    return response.data;
}
