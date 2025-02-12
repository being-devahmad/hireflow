import OnBoardingForm from "@/components/forms/onboarding/OnBoardingForm";
import React from "react";

// import { redirect } from "next/navigation";



const OnboardingPage = async () => {
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnBoardingForm />
    </div>
  );
};

export default OnboardingPage;