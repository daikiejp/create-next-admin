"use server";

import { signIn } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        //error: error.cause?.err?.message || "Authentication error"
        error: "Errors.invalidCredentials",
      };
    }
    return { error: "Error 500" };
  }
};

export const registerAction = async (
  values: z.infer<typeof registerSchema>,
) => {
  try {
    const { data, success } = registerSchema.safeParse(values);
    if (!success) {
      return { error: "Invalid data" };
    }

    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return { error: "Errors.userExists" };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Remove those two lines in production
    // Also delete 'role' inside db.user.create() method.
    const userCount = await db.user.count();
    const role = userCount === 0 ? "admin" : "user";

    await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: passwordHash,
        role,
      },
    });

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        //error: error.cause?.err?.message || "Authentication error" };
        error: "Errors.invalidCredentials",
      };
    }
    return { error: "Error 500" };
  }
};
