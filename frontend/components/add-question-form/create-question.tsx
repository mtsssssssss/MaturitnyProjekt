import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@radix-ui/react-select";
import { error } from "console";
import { FieldInfo } from "../custom-form-inputs/field-info";

export default function CreateQuestion() {
  return (
    <div>
      <>
        <Field>
          <FieldLabel htmlFor={"1"}>Typ otázky</FieldLabel>
          <Select
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyber predmet" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="abcd">abcd</SelectItem>
                <SelectItem value="writing">writing</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </>
    </div>
  );
}
