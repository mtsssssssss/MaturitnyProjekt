import api from "@/api/axios";
import {
  StartTestRequest,
  StartTestResponse,
  TestCreate,
  SubmitAnswerRequest,
  FinishTestRequest,
  FinishTestResponse,
  ManualTestCreate,
  AssignedTestListItem,
  AttemptResultListItem,
  StudentAttemptResultListItem,
} from "@/types/api/tests";

export const createRandomTest = async (data: TestCreate) => {
  const response = await api.post("/Tests/create-random-test", data);
  return response.data;
};

export const createManualTest = async (
  data: ManualTestCreate,
): Promise<{ id: string }> => {
  const response = await api.post("/Tests/create-manual-test", data);
  return response.data;
};

export const startTest = async (
  data: StartTestRequest,
): Promise<StartTestResponse> => {
  const response = await api.post("/Tests/test-start", data);
  return response.data;
};

export const submitAnswer = async (
  data: SubmitAnswerRequest,
): Promise<boolean> => {
  const payload: any = {
    testAttemptId: data.testAttemptId,
    questionId: data.questionId,
  };

  if (data.selectedAbcdAnswerId) {
    payload.selectedAbcdAnswerId = data.selectedAbcdAnswerId;
  }

  if (
    data.writtenAnswer !== undefined &&
    data.writtenAnswer !== null &&
    data.writtenAnswer.trim() !== ""
  ) {
    payload.writtenAnswer = data.writtenAnswer;
  }

  const response = await api.post("/Tests/submit-answer", payload);
  return response.data;
};

export const finishTest = async (
  data: FinishTestRequest,
): Promise<FinishTestResponse> => {
  const response = await api.post("/Tests/finish-test", data);
  return response.data;
};

export const getAssignedTests = async (): Promise<AssignedTestListItem[]> => {
  const { data } = await api.get<AssignedTestListItem[]>("/Tests/assigned");
  return data;
};

export const getMyAttempts = async (): Promise<AttemptResultListItem[]> => {
  const { data } = await api.get<AttemptResultListItem[]>("/Tests/my-attempts");
  return data;
};

export const getStudentAttempts = async (): Promise<
  StudentAttemptResultListItem[]
> => {
  const { data } = await api.get<StudentAttemptResultListItem[]>(
    "/Tests/student-attempts",
  );
  return data;
};
