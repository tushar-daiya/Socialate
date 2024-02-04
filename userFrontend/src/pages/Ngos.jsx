import Ngo from "@/components/Ngo";
import { useGetNgoQuery } from "@/redux/api/allApi";
import React from "react";
function Ngos() {
  const { isError, isFetching, isLoading, data } = useGetNgoQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div>
      <h2>Ngos near you</h2>
      <div className="grid sm:grid-cols-2 mt-5 grid-cols-1 gap-5">
        {data?.data.map((ngo) => {
          return <Ngo key={ngo?._id} ngo={ngo} />;
        })}
      </div>
    </div>
  );
}

export default Ngos;
