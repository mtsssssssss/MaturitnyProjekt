import api from "@/api/axios";

export const deleteSubject = async (id: string) => {
    const response = await api.delete(`/Subjects/${id}`);
    return response.data;
}
