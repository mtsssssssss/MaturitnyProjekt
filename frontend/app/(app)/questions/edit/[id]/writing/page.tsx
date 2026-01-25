"use client";

import QuestionWritingForm from "@/components/create-question/create-edit-writing-question-form";
import { useParams } from "next/navigation";

export default function EditAbcdQuestion() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <QuestionWritingForm id={id} />;
}
