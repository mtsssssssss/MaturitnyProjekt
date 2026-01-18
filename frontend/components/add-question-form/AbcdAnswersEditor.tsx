"use client";

import type { AnyFormApi } from "@tanstack/react-form";

export const AbcdAnswersEditor = ({ form, qIndex }: { form: any; qIndex: number }) => {
  return (
    <div className="mt-4 space-y-2 border-l-4 border-blue-200 pl-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-slate-600">Možnosti (ABCD)</label>
        <button
          type="button"
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          // Používame "as any", aby TS neprotestoval proti dynamickej ceste
          onClick={() => form.pushFieldValue(`testQuestions[${qIndex}].abcdAnswers` as any, { answer: "", isRight: false })}
        >
          + Pridať odpoveď
        </button>
      </div>

      <form.Subscribe selector={(state: any) => state.values.testQuestions[qIndex]?.abcdAnswers}>
        {(answers: any[] | undefined) => (
          <div className="space-y-2">
            {answers?.map((_: any, aIndex: number) => (
              <div key={aIndex} className="flex items-center gap-2">
                <form.Field name={`testQuestions[${qIndex}].abcdAnswers[${aIndex}].isRight` as any}>
                  {(field: any) => (
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  )}
                </form.Field>
                <form.Field name={`testQuestions[${qIndex}].abcdAnswers[${aIndex}].answer` as any}>
                  {(field: any) => (
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Text možnosti..."
                      className="flex-1 border-b focus:border-blue-500 outline-none"
                    />
                  )}
                </form.Field>
                <button 
                   type="button" 
                   onClick={() => form.removeFieldValue(`testQuestions[${qIndex}].abcdAnswers` as any, aIndex)}
                   className="text-red-500 text-sm"
                >
                  Odstrániť
                </button>
              </div>
            ))}
          </div>
        )}
      </form.Subscribe>
    </div>
  );
};