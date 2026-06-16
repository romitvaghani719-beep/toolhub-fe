import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@toolhub/shared";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/browse";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <div className="card card--pad w-full max-w-md fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">ToolVault</h1>
          <p className="text-sm text-[var(--text-3)] mt-1">Sign in to the AI Tools Directory</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) =>
            login.mutate(data, { onSuccess: () => navigate(from, { replace: true }) }),
          )}
        >
          <div className="field">
            <label className="field__label">Email</label>
            <input className="input w-full" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="field">
            <label className="field__label">Password</label>
            <input className="input w-full" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {login.isError && (
            <p className="text-sm text-red-600">
              {(login.error as Error).message ?? "Login failed"}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
