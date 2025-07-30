import prisma from "../../../../lib/prisma.js";
import { registerSchema } from "../../../../validators/zodSchemas.js";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (existingUser)
    return Response.json({ error: "Email already used" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
    },
  });

  return Response.json({ message: "User registered", userId: user.id });
}
