import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { selectNgo } from "@/redux/features/ngo/ngoSlice";
import { useGetCampByIdQuery } from "@/redux/api/authApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VolunteerTableItem from "@/components/VolunteerTableItem";
import DonationTableItem from "@/components/DonationTableItem";

function CampPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();
  const { isLoading, isError, isSuccess, data } = useGetCampByIdQuery(id);

  const handleClick = async () => {
    await applyVolunteer(data?.data?._id);
    setModalOpen(false);
  };
  const ngo = useSelector(selectNgo);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <img
        src={data?.data?.campBanner}
        className="w-full aspect-[4/1] rounded-lg"
        alt="htllo"
      />
      <div className="mt-5 w-full flex justify-end">
        <Button
          onClick={() => navigate(`/editcamp/${data?.data?._id}`)}
          className=""
        >
          Edit Camp
        </Button>
      </div>
      <div className="mt-5 flex sm:flex-row flex-col sm:divide-x-2 gap-10">
        <div className="sm:w-3/5">
          <h1>{data?.data?.campName}</h1>
          <p className="mt-5 leading-7">{data?.data?.campDescription}</p>
        </div>
        <div className="sm:w-2/5 sm:pl-5">
          <div>
            <h2>Location</h2>
            <p className="mt-2">{data?.data?.campAddress.street}</p>
            <p>
              {data?.data?.campAddress.city}, {data?.data?.campAddress.state},{" "}
              {data?.data?.campAddress.pincode}
            </p>
          </div>
          <div className="mt-10">
            <h2>Timing</h2>
            <p className="mt-2">
              {moment(data?.data?.campTiming).format("Do MMM YY")}
            </p>
            <p className="mt-2">
              {moment(data?.data?.campTiming).format("LT")} onwards
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2>Volunteers</h2>
        <div className="mt-2">
          {data?.data?.campVolunteers.length === 0 && (
            <div className="">No Volunteers</div>
          )}
          {data?.data?.campVolunteers.length > 0 && (
            <Table className="text-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Volunteer Name</TableHead>
                  <TableHead>Volunteer PHone</TableHead>
                  <TableHead className="text-right w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.campVolunteers.map((volunteer) => (
                  <VolunteerTableItem
                    key={volunteer?._id}
                    volunteer={volunteer}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h2>Donations</h2>
        <div className="mt-5">
          {data?.data?.campDonations.length === 0 && (
            <div className="text-xl font-semibold text-center">No Donations</div>
          )}
          {data?.data?.campDonations.length > 0 && (
            <Table className="text-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Food Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Info</TableHead>
                  <TableHead className="text-right w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.campDonations?.map((donation) => (
                  <DonationTableItem key={donation?._id} donation={donation} />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampPage;
