import prisma from "../../../lib/prisma";
import { authenticate } from "../../../middlewares/auth";
import { postSchema } from "../../../validators/zodSchemas";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const tag = searchParams.get("tag"); //fyfiygiuguioguio

  const posts = await prisma.post.findMany({
    where: {
      title: { contains: search },
      category: category || undefined,
      tags: tag ? { has: tag } : undefined, //hgdtgfujyfu
    },
    include: {
      author: { select: { email: true } },
      comments: {
        include: { author: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts);
}

export async function POST(req) {
  const auth = authenticate(req);
  if (auth.status !== 200)
    return Response.json({ error: "Unauthorized" }, { status: auth.status });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      ...body,
      authorId: auth.user.userId,
    },
  });

  return Response.json(post);
}
