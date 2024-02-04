import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import DonationTableItem from "@/components/DonationTableItem";
import { useGetAllVolunteersQuery } from "@/redux/api/authApi";
import VolunteerTableItem from "@/components/VolunteerTableItem";

function Volunteers() {
  const { isError, isFetching, isSuccess, data } = useGetAllVolunteersQuery();
  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  console.log(data);
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-10">Volunteers</h1>
      {data?.data?.length === 0 && (
        <div className="flex h-96 text-2xl font-bold w-full items-center justify-center">
          No Volunteers
        </div>
      )}
      {data?.data?.length > 0 && (
        <Table className="text-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Volunteer Name</TableHead>
              <TableHead>Volunteer Phone</TableHead>
              <TableHead>Camp Name</TableHead>
              <TableHead>Camp Timing</TableHead>
              <TableHead className="text-right w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((volunteer) => (
              <VolunteerTableItem key={volunteer?._id} volunteer={volunteer} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Volunteers;
