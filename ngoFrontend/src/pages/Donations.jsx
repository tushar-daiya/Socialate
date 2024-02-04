import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllDonationsQuery } from "@/redux/api/authApi";
import { useState } from "react";
import DonationTableItem from "@/components/DonationTableItem";

function Donations() {
  const { isError, isFetching, isSuccess, data } = useGetAllDonationsQuery();
  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-10">Donations</h1>
      {data?.data?.length === 0 && <div className="flex h-96 text-2xl font-bold w-full items-center justify-center">No Donations</div>}
      {data?.data?.length > 0 && (
        <Table className="text-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Food Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Camp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Info</TableHead>
              <TableHead className="text-right w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((donation) => (
              <DonationTableItem key={donation?._id} donation={donation} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Donations;
