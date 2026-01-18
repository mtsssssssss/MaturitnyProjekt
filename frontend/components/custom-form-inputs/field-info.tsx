import { AnyFieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;

  const errorMessages = errors.map((err) => {
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    return JSON.stringify(err);
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
