// why we need this webhook, as we know that payment are not synchronous so we'll made a webhook which will update the post status from draft to published as soon as payment is verified by stripe

import { prisma } from "@/utils/prisma";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  console.log("HeadersList--->", headersList);

  const signature = headersList.get("Stripe-Signature") as string;
  console.log("signature----->", signature);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response(`Webhook error --> ${error} `, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const jobId = session?.metadata?.jobId;

  if (!jobId) {
    return new Response("No jobId was found", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer;

    const company = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId as string,
      },
      select: {
        Company: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!company) {
      return new Response("No company found for this user", {
        status: 400,
      });
    }

    await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: company.Company?.id as string,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  return new Response(null, {
    status: 200,
  });
}
