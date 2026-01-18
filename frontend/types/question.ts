export type Question = {
    id: string;
    questionText: string;
    subjectId: string;
    questionType: "Abcd" | "Writing";
    abcdAnswers?: AbcdAnswer[];
    answer?: string;
}

export type AbcdAnswer = {
    id: string;
    answer: string;
    isRight: boolean;
}
