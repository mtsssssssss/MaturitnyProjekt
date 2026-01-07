import { SignupForm } from "@/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrovať sa",
};

export default function page() {
  return <SignupForm />;
}
