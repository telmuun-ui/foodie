import { connectDB } from "@/lib/db";
import { generateOTP } from "@/utils";
import { UserModel, OTPModel } from "@/models";
import { sendVerificationEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      await OTPModel.deleteMany({ userId: existing._id });
      await existing.deleteOne();
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const safeRole = role === "admin" ? "admin" : "user";
    const user = await UserModel.create({
      name,
      email,
      password,
      role: safeRole,
      expiresAt,
    });

    const otp = generateOTP();
    await OTPModel.create({ userId: user._id, otp, type: "email_verification", expiresAt });

    await sendVerificationEmail(email, name, otp);

    return NextResponse.json(
      {
        message: "Registration successful. Check your email for the verification OTP (valid 10 minutes).",
        userId: user._id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: `Internal server error ${error}` }, { status: 500 });
  }
};
