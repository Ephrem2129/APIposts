import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
});

export const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
