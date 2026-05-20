"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/auth";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email({ message: "Enter a valid email address" }),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError("");
    try {
      await login(data);
      router.push("/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-background rounded-lg flex items-center justify-center">
            <ShieldCheck size={16} className="text-foreground" />
          </div>
          <span className="text-background font-semibold text-sm tracking-tight">Admin Portal</span>
        </div>
        <div className="flex flex-col gap-4">
          <blockquote className="text-background/80 text-lg leading-relaxed">
            &ldquo;Manage your restaurant operations, track orders, and keep your menu up to date — all in one place.&rdquo;
          </blockquote>
          <p className="text-background/40 text-sm">3F Students Food Delivery</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your admin account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* API error */}
            {apiError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                <p className="text-sm text-destructive">{apiError}</p>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
