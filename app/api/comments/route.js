import prisma from "../../../lib/prisma";
import { authenticate } from "../../../middlewares/auth";
import { commentSchema } from "../../../validators/zodSchemas";

export async function POST(req) {
  const auth = authenticate(req);
  if (auth.status !== 200)
    return Response.json({ error: "Unauthorized" }, { status: auth.status });

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      postId: body.postId,
      authorId: auth.user.userId,
    },
    include: {
      author: { select: { email: true } },
    },
  });

  return Response.json(comment);
}
