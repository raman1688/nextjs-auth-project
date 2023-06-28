import { connectDB } from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

connectDB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // check if user exist
    const user = await User.findOne({
      email: reqBody.email,
    });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      reqBody.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    // check if user is verified
    if (!user.isEmailVerified) {
      throw new Error("Email not verified");
    }

    const dataToEncrypt = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(dataToEncrypt, process.env.jwt_secret!, {
      expiresIn: "1d",
    });

    // cookies().set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    // });
    const response = NextResponse.json({
      message: "Login successful!",
      success: true,
      data: null,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
