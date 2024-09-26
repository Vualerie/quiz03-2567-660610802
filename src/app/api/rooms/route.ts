import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { originalDB } from '@lib/DB';
import { Room ,Payload} from "@lib/DB";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: originalDB.rooms,
    totalRooms: originalDB.rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  const body: { roomName: string} = await request.json();
  let role: string | null = null;
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    const foundDupe = originalDB.rooms.find((room: Room) => room.roomName === body.roomName);
    if (foundDupe) {
      return NextResponse.json(
    {
      ok: false,
      message: `Room ${"replace this with room name"} already exists`,
    },
    { status: 400 }
  );}

  const roomId = nanoid();

  //call writeDB after modifying Database
  writeDB();
  originalDB.rooms.push({ roomId: roomId, roomName: body.roomName});
  

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
}
};
