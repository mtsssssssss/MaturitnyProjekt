import { FieldInfo } from "./field-info";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Option {
  key: string,
  value: string | number;
  text: string;
}

interface FormSelectProps {
  field: any;
  label: string;
  options?: Option[];
  placeholder?: string;
  description?: string;
}

export const TanStackFormSelect = ({
  field,
  label,
  options,
  placeholder,
  description,
}: FormSelectProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Vyber položku"} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <FieldDescription>
        {description}
        <FieldInfo field={field} />
      </FieldDescription>
    </Field>
  );
};
