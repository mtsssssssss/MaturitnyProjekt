"use client";

import { AbcdAnswersEditor } from "@/components/add-question-form/AbcdAnswersEditor";
import { useForm } from "@tanstack/react-form";
// ... ostatné importy

export default function CreateTest() {
  // 1. Riešenie: Použi any ako typový argument pre useForm
  // To odstráni chybu o 12 argumentoch a odomkne metódy ako pushFieldValue
  const form = useForm({
    defaultValues: {
      testName: "",
      testTime: 30,
      testQuestions: [] as any[], // Explicitne povieme, že je to pole
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      {/* ... názov testu atď ... */}

      <button
        type="button"
        className="bg-black text-white px-4 py-2 rounded-md"
        onClick={() => {
          // 2. Riešenie: "as any" pri názve poľa, ak stále hlási 'never'
          form.pushFieldValue("testQuestions" as any, {
            questionText: "",
            questionType: 1, 
            abcdAnswers: [],
            answer: null
          });
        }}
      >
        Pridať otázku
      </button>

      {/* Subscribe musí mať tiež typovaný state ako any, aby nebol never */}
      <form.Subscribe selector={(state: any) => state.values.testQuestions}>
        {(questions: any[]) => (
          <div className="space-y-4">
            {questions?.map((_, i) => (
              <div key={i}>
                <form.Field
                  name={`testQuestions[${i}].questionText` as any}
                  children={(field) => (
                    <input 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                    />
                  )}
                />
                {/* Editor odpovedí */}
                <AbcdAnswersEditor form={form} qIndex={i} />
              </div>
            ))}
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}