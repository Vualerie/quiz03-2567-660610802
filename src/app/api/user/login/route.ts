import jwt from "jsonwebtoken";
import { DB, readDB, User } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/DB";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { username, password } = body;
  readDB();

  //you should do the validation here
  const user = (<Database>DB).users.find(
    (user: User) => user.username === username && user.password === password
  );

  if(!user){
  return NextResponse.json(
    {
      ok: false,
      message: "Username or Password is incorrect",
    },
    { status: 400 }
  );
  }

  const secret = process.env.JWT_SECRET || "secret.exe";

  const token = jwt.sign({ username, role: user.role }, secret, { expiresIn: '1h' });


  return NextResponse.json({ ok: true, token });
};
