import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrovať sa",
};

export default function RegisterPage() {
  return <SignupForm />;
}
