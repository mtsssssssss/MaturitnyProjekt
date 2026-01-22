import { FieldInfo } from "./field-info";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface FormInputProps {
  field: any;
  label: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  description?: string;
  className? :string | undefined
}

export const TanStackFormInput = ({
  field,
  label,
  type = "text",
  placeholder,
  description,
}: FormInputProps) => {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          onChange={(e) => {
            const val =
              type === "number" ? Number(e.target.value) : e.target.value;
            field.handleChange(val);
          }}
        />
        <FieldDescription>
          <span>{description}</span>
          <FieldInfo field={field} />
        </FieldDescription>
      </Field>
    </>
  );
};
