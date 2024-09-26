import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Sirawit Seetong",
    studentId: "660610802",
  });
};
