import { FieldApi } from "@tanstack/react-form";
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
  key: string;
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
      <FieldLabel htmlFor={field.name} className="font-semibold text-slate-700">
        {label}
      </FieldLabel>

      <Select
        value={field.state.value?.toString() || ""}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger 
          id={field.name}
          className="w-full bg-white border-slate-200 focus:ring-orange-500 transition-all"
        >
          <SelectValue placeholder={placeholder || "Vyberte možnosť"} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options && options.length > 0 ? (
              options.map((option) => (
                <SelectItem 
                  key={option.key} 
                  value={option.value.toString()}
                  className="cursor-pointer"
                >
                  {option.text}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground text-center">
                Žiadne možnosti k dispozícii
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {(description || field.state.meta.errors.length > 0) && (
        <FieldDescription className="mt-1">
          {description}
          <FieldInfo field={field} />
        </FieldDescription>
      )}
    </Field>
  );
};