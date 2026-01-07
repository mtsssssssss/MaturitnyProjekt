import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Vytvoriť si svoj účet</CardTitle>
        <CardDescription>
          // DOROBIŤ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Prihlasovacie meno</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            {/*

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="x@email.sk"
                required
              />
              
            </Field>

            */}
            <Field>
              <FieldLabel htmlFor="password">Heslo</FieldLabel>
              <Input id="password" type="password" required />
              {/* <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Potvrdiť heslo
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              {/* <FieldDescription>Please confirm your password.</FieldDescription> */}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Vytvoriť si účet</Button>
                
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
