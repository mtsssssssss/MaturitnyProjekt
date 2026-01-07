import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prihlásiť sa",
};

export default function page() {
  return <LoginForm />;
}
