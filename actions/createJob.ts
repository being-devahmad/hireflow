"use server";

import { aj } from "@/utils/aj";
import { userExists } from "@/utils/hooks";
import { prisma } from "@/utils/prisma";
import { jobSchema } from "@/utils/validations";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await userExists();

  // Access the request object so Arcjet can analyze it
  const req = await request();
  // Call Arcjet protect
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  await prisma.jobPost.create({
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
      companyId: company.id,
    },
  });

  return redirect("/");
}
