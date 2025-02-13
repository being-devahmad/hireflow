"use server";

import { userExists } from "@/utils/hooks";
import { z } from "zod";
import { companySchema } from "@/utils/validations";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export const createCompany = async (data: z.infer<typeof companySchema>) => {
  const session = await userExists();

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

  return redirect('/')
};
