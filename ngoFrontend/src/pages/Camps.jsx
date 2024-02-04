import Camp from "@/components/Camp";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCampsQuery } from "@/redux/api/authApi";
import React from "react";
import { useEffect } from "react";

function Camps() {
  const { isError, isFetching, isSuccess, data } = useGetAllCampsQuery();
  if (isFetching) {
    return (
      <div>
        <h1>My camps</h1>
        <div className="grid md:grid-cols-4 mt-5 sm:grid-cols-3 gap-5">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[182px] w-[325px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[182px] w-[325px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[182px] w-[325px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[182px] w-[325px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1>My camps</h1>
      <div className="grid md:grid-cols-4 mt-5 sm:grid-cols-3 gap-5">
        {isFetching && <div></div>}
        {data?.data.map((camp) => {
          return <Camp camp={camp} key={camp?._id} />;
        })}
      </div>
    </div>
  );
}

export default Camps;
