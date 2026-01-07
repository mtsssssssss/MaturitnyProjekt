import { AnyFieldApi } from "@tanstack/react-form";

/*
export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
  */


export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;

  // prekonvertujeme každý error na string
  const errorMessages = errors.map((err) => {
    if (typeof err === 'string') return err;
    if (err?.message) return err.message; // napr. ZodErrorIssue
    return JSON.stringify(err); // fallback
  });

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500">{errorMessages.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? <span>Validating...</span> : null}
    </>
  );
}
