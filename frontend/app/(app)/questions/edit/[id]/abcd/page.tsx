"use client";

import QuestionAbcdForm from "@/components/create-edit-question/create-edit-abcd-question-form";
import { useParams } from "next/navigation";

export default function EditAbcdQuestion() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <QuestionAbcdForm id={id} />;
}
