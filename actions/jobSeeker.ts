"use server";

import { userExists } from "@/utils/hooks";
import { z } from "zod";
import { jobSeekerSchema } from "@/utils/validations";
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

export const createJobSeeker = async (
  data: z.infer<typeof jobSeekerSchema>
) => {
  const session = await userExists();

    // for aj protecttion
  
    const req = await request();
    const decision = await aj.protect(req);
  
    if (decision.isDenied()) {
      throw new Error("Forbidden");
    }
  

  // for type safety
  const validateData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id as string,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
};
