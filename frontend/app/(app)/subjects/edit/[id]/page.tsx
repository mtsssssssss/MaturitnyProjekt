"use client"

import SubjectForm from "@/components/create-edit-subject/create-edit-subject-form";
import { useParams } from "next/navigation";

export default function EditSubject() {
  const params = useParams();

  // https://nextjs.org/docs/app/api-reference/functions/use-params
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <SubjectForm id={id} />
  )
}
