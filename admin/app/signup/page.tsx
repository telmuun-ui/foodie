"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup, verifyEmail } from "@/services/auth";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

function PasswordInput({
  id,
  placeholder,
  disabled,
  error,
  autoComplete,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error}
        className={error ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setApiError("");
    try {
      const response = await signup({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: "admin",
      });
      setPendingUserId(response.userId);
      setPendingEmail(data.email.trim());
      setOtp("");
      setStep("verify");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to create account");
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6 || !pendingUserId) return;

    setApiError("");
    setIsVerifying(true);

    try {
      await verifyEmail({ userId: pendingUserId, otp });
      router.push("/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to verify email");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {step === "signup" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

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
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <PasswordInput
                    id="password"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    error={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    error={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {apiError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                    <p className="text-sm text-destructive">{apiError}</p>
                  </div>
                )}

                <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setApiError("");
                    setStep("signup");
                  }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to {pendingEmail}. Enter it below to finish creating your admin account.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleVerify();
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Verification code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={isVerifying}
                    className="text-center text-lg tracking-[0.35em]"
                  />
                </div>

                {apiError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                    <p className="text-sm text-destructive">{apiError}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={otp.length !== 6 || isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify & sign in"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
