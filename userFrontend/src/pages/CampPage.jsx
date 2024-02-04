import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Ngo from "@/components/Ngo";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/user/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "@/components/User";
import {
  useApplyasVolunteerMutation,
  useGetCampByIdQuery,
  useRemoveVolunteerMutation,
} from "@/redux/api/allApi";
import { Link } from "react-router-dom";

function CampPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const { id } = useParams();
  const { isLoading, isError, isSuccess, data } = useGetCampByIdQuery(id);
  const [
    applyVolunteer,
    {
      isError: avisError,
      error: avError,
      data: avData,
      isLoading: avisLoading,
      isSuccess: avisSuccess,
    },
  ] = useApplyasVolunteerMutation();
  const [
    removeVolunteer,
    {
      isError: rmisError,
      error: rmError,
      data: rmData,
      isLoading: rmisLoading,
      isSuccess: rmisSuccess,
    },
  ] = useRemoveVolunteerMutation();
  useEffect(() => {
    if (avisSuccess) {
      toast.success(avData?.message);
    }
    if (avisError) {
      toast.error(avError?.data?.message);
      console.log(avError);
    }
  }, [avisLoading]);

  useEffect(() => {
    if (rmisSuccess) {
      toast.success(rmData?.message);
    }
    if (rmisError) {
      toast.error(rmError?.data?.message);
      console.log(rmError);
    }
  }, [rmisLoading]);

  const applyAsVolunteer = async () => {
    await applyVolunteer(data?.data?._id);
    setModalOpen(false);
  };
  const removeApplication = async () => {
    await removeVolunteer(data?.data?._id);
    setModalOpen(false);
  };
  const user = useSelector(selectUser);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <img
        src={data?.data?.campBanner}
        className="w-full aspect-[4/1]"
        alt="campBanner"
      />
      <div className="mt-10 flex sm:flex-row flex-col sm:divide-x-2 gap-10">
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
            <p> {moment(data?.data?.campTiming).format("LT")} onwards</p>
          </div>
          <Dialog open={donateModalOpen} onOpenChange={setDonateModalOpen}>
            <DialogTrigger asChild className="w-full">
              <Button className="mt-5 w-full">Donate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Donate</DialogTitle>
                <DialogDescription>
                  Choose what you want to donate!
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-5">
                <div className="w-1/2 aspect-square font-bold flex items-center justify-center shadow-sm rounded-2xl hover:shadow-lg">
                  <Link to={`/dashboard/donatefood/${data?.data?._id}`}>
                    {" "}
                    Donate Food
                  </Link>
                </div>
                <div className="w-1/2 aspect-square font-bold flex items-center justify-center shadow-sm rounded-2xl hover:shadow-lg">
                  <Link to={`/dashboard/donatemoney/${data?.data?._id}`}>
                    Donate Money
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => navigate(`/donate/${data?.data?._id}`)}
            className="mt-10 block w-full"
          >
            Donate
          </Button> */}
          {data?.data?.campVolunteers?.some(
            (volunteer) => volunteer.user._id === user?._id
          ) ? (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild className="w-full">
                <Button className="mt-5 w-full">
                  {!avisLoading ? (
                    "Withdraw Application"
                  ) : (
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    Your application will be removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      disabled={rmisLoading}
                      variant="secondary"
                      className="mr-4"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button disabled={rmisLoading} onClick={removeApplication}>
                    {rmisLoading ? (
                      <ReloadIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild className="w-full">
                <Button className="mt-5 w-full">
                  {!avisLoading ? (
                    "Apply as volunteer"
                  ) : (
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    You will be registered as a volunteer for this camp.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary" className="mr-4">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={applyAsVolunteer}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h2>Organised By</h2>
        <div className="mt-5">
          <Ngo ngo={data?.data?.campNgo} />
        </div>
      </div>
      <div className="mt-10">
        <h2>Volunteers</h2>
        <div className="flex flex-wrap gap-5 mt-5">
          {data?.data?.campVolunteers.length === 0 && <p>No Volunteers yet</p>}
          {data?.data?.campVolunteers.length > 0 &&
            data?.data?.campVolunteers?.map((volunteer) => (
              <User volunteer={volunteer} key={volunteer?.user?._id} />
            ))}
        </div>
      </div>
      <div className="mt-10">
        <h2>Donations</h2>
        <div className="mt-5">
          {data?.data?.campDonations?.length === 0 && <p>No Donations yet</p>}
          <ol className="list-disc">
            {data?.data?.campDonations.length > 0 &&
              data?.data?.campDonations?.map((donation) => (
                <li className="mt-2" key={donation._id}>
                  {donation?.donatedBy?.fullName} donated {donation?.foodName}
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CampPage;
