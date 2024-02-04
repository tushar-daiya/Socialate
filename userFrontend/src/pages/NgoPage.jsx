import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { MdVerified } from "react-icons/md";
import Camp from "@/components/Camp";
import { useGetNgoByIdQuery } from "@/redux/api/allApi";
function NgoPage() {
  const { id } = useParams();

  const { isError, isFetching, isSuccess, data } = useGetNgoByIdQuery(id);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <div className="p-5">
      <div className="flex sm:flex-row flex-col gap-10 items-center">
        <Avatar className="w-60 h-60">
          <AvatarImage src={data?.data?.logoUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex md:flex-row flex-col gap-10 justify-between w-full">
          <div>
            <h1>{data?.data?.name}</h1>
            <p className="mt-10">
              <Mail className="inline-block mr-5" />
              {data?.data?.email}
            </p>
            <p className="mt-1">
              <Phone className="inline-block mr-5" />
              +91{data?.data?.phone}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold flex gap-2">
              <MapPin />
              Office Address
            </h3>
            <div className="ml-8">
              <p className="mt-5">{data?.data?.address?.street}</p>
              <p className="mt-1">
                {data?.data?.address?.city}, {data?.data?.address?.state},{" "}
                {data?.data?.address?.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />
      <div className="mt-10">
        <div className="flex gap-5 items-center">
          <h2>About Us</h2>
          <div className="w-1/5 border-solid border-2 border-white h-0 rounded-full"></div>
        </div>
        <p className="mt-5 leading-8">{data?.data?.about}</p>
      </div>
      <Separator className="my-10" />
      <div className="mt-10">
        <div className="flex gap-5 items-center">
          <h2>Camps</h2>
          <div className="w-1/5 border-solid border-2 border-white h-0 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-5 sm:grid-cols-2">
          {data?.data?.donationCamps?.map((camp) => {
            return <Camp camp={camp} key={camp._id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default NgoPage;
