import api from "@/api/axios";

export const deleteQuestion = async (id: string) => {
    const response = await api.delete(`/Questions/${id}`);
    return response.data;
}
