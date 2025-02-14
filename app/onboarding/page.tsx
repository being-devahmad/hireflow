import OnBoardingForm from "@/components/forms/onboarding/OnBoardingForm";
import { userExists } from "@/utils/hooks";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import React from "react";

// import { redirect } from "next/navigation";

// check if user has finished onboarding

const checkIfUserHasFinishedOnBoarding = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  });

  if (user?.onboardingCompleted === true) {
    return redirect("/");
  }

  return user;
};

const OnboardingPage = async () => {
  const session = await userExists();
  await checkIfUserHasFinishedOnBoarding(session.id as string);

  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnBoardingForm />
    </div>
  );
};

export default OnboardingPage;
