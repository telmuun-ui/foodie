"use client";

import { useContext, useState } from "react";
import { useFormik } from "formik";
import { determineValidationSchema, handleSignUp, handleVerifyEmail } from "@/lib";
import { SignUpEmailBox } from "./SignUpEmailBox";
import { SignUpPasswordBox } from "./SignUpPasswordBox";
import { OtpVerificationBox } from "./OtpVerificationBox";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/(main)/context";

export const Signup = () => {
  const { push } = useRouter();
  const { setUser } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: determineValidationSchema(currentStep),
    onSubmit: async (values) => {
      const data = await handleSignUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (data?.userId) {
        setUserId(data.userId);
        setCurrentStep(2);
      }
    },
  });

  const handleVerifyOtp = async (otp: string) => {
    const data = await handleVerifyEmail({ userId, otp });
    if (data?.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      setUser(data.user);
      push("/");
    }
  };

  const handleNext = () => {
    setCurrentStep((previous) => previous + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((previous) => previous - 1);
  };

  const emailBoxProps = {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    handleNext: handleNext,
  };
  const passwordBoxProps = {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    handleCreateAccount: formik.handleSubmit,
    handleBack: handlePrevious,
  };

  const StepComponents = [
    <SignUpEmailBox key={0} {...emailBoxProps} />,
    <SignUpPasswordBox key={1} {...passwordBoxProps} />,
    <OtpVerificationBox
      key={2}
      email={formik.values.email}
      onVerify={handleVerifyOtp}
      onBack={handlePrevious}
    />,
  ];

  return StepComponents[currentStep];
};
