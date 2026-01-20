import api from "@/api/axios";
import { StartTestRequest, StartTestResponse, TestCreate } from "@/types/api/tests";


export const createRandomTest = async (data: TestCreate) => {
    const response = await api.post("/Tests/create-random-test", JSON.stringify(data));
    return response.data;
}

export const startTest = async (data: StartTestRequest): Promise<StartTestResponse> => {
  const response = await api.post("/Tests/start-test", data);
  return response.data;
};


