import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <SignIn routing="hash" />
    </div>
  );
}
