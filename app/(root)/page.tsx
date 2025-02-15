import JobFilters from "@/components/general/JobFilter";
import JobListings from "@/components/general/JobListings";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        <JobFilters />
        <div className="col-span-2 flex flex-col gap-6">
          <JobListings />
          {/* <Suspense key={filterKey} fallback={<JobListingsLoading />}>
          
        </Suspense> */}
        </div>
      </div>
    </>
  );
}
