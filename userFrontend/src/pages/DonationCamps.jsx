import Camp from "@/components/Camp";
import { useGetAllCampsQuery } from "@/redux/api/allApi";
import React from "react";

function DonationCamps() {
  const { isError, isSuccess, isFetching, data } = useGetAllCampsQuery();
  return (
    <div>
      <h2>Camps near you</h2>
      <div className="grid md:grid-cols-4 sm:grid-cols-3 mt-5 gap-5">
        {data?.data.map((camp) => {
          return <Camp camp={camp} key={camp?._id} />;
        })}
      </div>
    </div>
  );
}

export default DonationCamps;
