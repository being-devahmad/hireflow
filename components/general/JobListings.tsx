import { prisma } from "@/utils/prisma";
import React from "react";
import { JobCard } from "./JobCard";
import { EmptyState } from "./EmptyState";

const getData = async () => {
  const data = await prisma.jobPost.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      jobTitle: true,
      jobDescription: true,
      id: true,
      salaryFrom: true,
      salaryTo: true,
      employmentType: true,
      location: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const JobListings = async () => {
  const jobs = await getData();

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job, index) => (
            <JobCard job={job} key={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}
    </>
  );
};

export default JobListings;
