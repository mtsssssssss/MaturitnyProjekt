import CreateAbcdQuestion from "@/components/create-question/create-abcd-question";
import CreateWritingQuestion from "@/components/create-question/create-writing-question";

export default function AddQuestion() {
  

  return <>
  <CreateWritingQuestion />
  <hr />
  <CreateAbcdQuestion />
  </>
}


/*

const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: "" as "Abcd" | "Writing" | "",
      abcdAnswers: [
        { answer: "", isRight: false },
        { answer: "", isRight: false },
      ],
      answer: "",
    },
    
    onSubmit: async ({ value }) => {
      const submitData = {
        questionText: value.questionText,
        subjectId: value.subjectId,
        questionType: value.questionType as "Abcd" | "Writing",
        abcdAnswers: value.questionType === "Abcd" ? value.abcdAnswers : undefined,
        answer: value.questionType === "Writing" ? value.answer : undefined,
      };
      postMutation.mutate(submitData);
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const postMutation = useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
        queryClient.invalidateQueries(["questions"]);
        router.push("/question")
    }
  })

*/