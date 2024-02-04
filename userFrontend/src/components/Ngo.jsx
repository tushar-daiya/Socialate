import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";
import { Mail } from "lucide-react";

function Ngo({ ngo }) {
  return (
    <NavLink to={`/dashboard/ngos/${ngo._id}`}>
      <Card className="flex items-center p-5 border-slate-100 border border-solid relative">
        <Badge
          variant={ngo?.isValidated ? "success" : "destructive"}
          className=" sm:text-lg absolute  top-0 right-0 rounded-none"
        >
          {ngo.isValidated ? "Verified" : "Not Verified"}
        </Badge>
        <div>
          <Avatar className="w-20 h-20">
            <AvatarImage src={ngo.logoUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-5">
          <h1>{ngo.name}</h1>
          <div className="flex mt-2 gap-2 items-center">
            <Mail />
            <p className="text-lg">{ngo.email}</p>
          </div>
          <div className="flex gap-2 items-center mt-5">
            <MapPin size={16} strokeWidth={2} />
            <p className="text-lg mt-1">
              {ngo.address.city},{ngo.address.state} {ngo.address.pincode}
            </p>
          </div>
        </div>
      </Card>
    </NavLink>
  );
}

export default Ngo;
