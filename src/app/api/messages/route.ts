import { Database, DB, Message, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { originalDB } from "@lib/DB";
import { Payload } from "@lib/DB";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const foundmessage = originalDB.messages.find((message) => message.roomId === roomId);
  if (!foundmessage) {
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );}

  let filtered = originalDB.messages;
  filtered = filtered.filter((messages) => messages.roomId === roomId);

  return NextResponse.json({
    ok: true,
    messages: filtered,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  readDB();
  const fRoom = originalDB.rooms.find((room) => room.roomId === body.roomId);
 if(fRoom!) {
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );}

  const messageId = nanoid();
  originalDB.messages.push({
    roomId: body.roomId,
    messageId: messageId,
    messageText: body.messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });


};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  let role = null;
  if (payload){
    role = (<Payload>payload).role;
  }
  if (!payload || role != "SUPER_ADMIN"){
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  );}

  readDB();
  const body = await request.json();
  const { messageId } = body;
  const fMessage = originalDB.messages.find((message) => message.messageId === body.messageId);
  if(!fMessage){
  return NextResponse.json(
    {
      ok: false,
      message: "Message is not found",
    },
    { status: 404 }
  );}
  const index:number = (<Database>DB).messages.findIndex((msg:Message)=> msg.messageId === messageId)
  console.log(index);
  delete (<Database>DB).messages[index];
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
