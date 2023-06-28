export const dynamic = "forced-dynamic";

import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/config/dbConfig";
connectDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
      message: "Users get success!!",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
