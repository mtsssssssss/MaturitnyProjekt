import api from "@/api/axios";

export type TestCreate = {
    time: number, 
    subjectId: string
}

export const createTest = async (data: TestCreate) => {
    const response = await api.post("/Tests", JSON.stringify(data));
    return response.data;
}
