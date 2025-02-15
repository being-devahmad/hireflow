"use server";

import { aj } from "@/utils/aj";
import { userExists } from "@/utils/hooks";
import { jobListingDurationPricing } from "@/utils/pricingTiers";
import { prisma } from "@/utils/prisma";
import { stripe } from "@/utils/stripe";
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
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });

    stripeCustomerId = customer.id;

    // update user with stripe customer id
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const jobPost = await prisma.jobPost.create({
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
    select: {
      // a little mutation as we only need id further therefor we'll optimize our query coz we don't need each and every thing  therefore we'll select if true only
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => (tier.days = validateData.listingDuration)
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://xupsso76t5.ufs.sh/f/WzRheWypImoFAtaMmpTkWeo3P18MXzHkyVmY9jvdTrb5BIE2",
            ],
          },

          currency: "USD",
          unit_amount: pricingTier.price * 100, // we've to multiple it by 100 as stripe work in cents if we don't do this it'll take it as 9$ but we have to take it as 99$
        },

        quantity: 1, // 1 job post
      },
    ],

    metadata: {
      jobId: jobPost.id,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}
