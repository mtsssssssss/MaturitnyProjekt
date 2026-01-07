import api from "@/api/axios";

type Subject = {
    id: string,
    subjectName: string,
    subjectAbbrev: string,
}

export const getSubjects = async (): Promise<Subject[]> => {
    const response = await api.get("/Subjects");
    return response.data;
}
