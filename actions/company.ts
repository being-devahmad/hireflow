"use server";

import { userExists } from "@/utils/hooks";
import { z } from "zod";
import { companySchema } from "@/utils/validations";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "@/utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export const createCompany = async (data: z.infer<typeof companySchema>) => {
  const session = await userExists();

  // for aj protecttion

  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // for type safety
  const validateData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
};
