import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "../../../../validators/zodSchemas.js";
import { signToken } from "../../../../utils/jwt";

export async function POST(req) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const isMatch = await bcrypt.compare(body.password, user.password);
  if (!isMatch)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ userId: user.id });

  return Response.json({ token });
}
