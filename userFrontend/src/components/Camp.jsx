import React from "react";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import moment from "moment";
import { Card } from "./ui/card";

function Camp({ camp }) {
  console.log(camp)
  return (
    <Link to={`/dashboard/camp/${camp._id}`}>
      <Card className="p-5 border-solid border h-full border-slate-100 rounded-lg">
        <AspectRatio ratio={16 / 9}>
          <img src={camp?.campBanner} className="rounded-lg w-full h-full" />
        </AspectRatio>
        <h2 className="mt-5 ">{camp.campName}</h2>
        <div className="mt-1 flex justify-between">
          <div>
            <p>
              {camp?.campAddress?.city}, {camp?.campAddress?.state}
            </p>
          </div>
          <div>
            <p>
              {moment(camp?.campTiming).format("MMM DD YYYY")}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default Camp;
