import React from "react";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import moment from "moment";

function Camp({ camp }) {
  console.log(camp)
  return (
    <Link to={`/camp/${camp._id}`}>
      <div className="p-5 hover:scale-95 transition-all">
        <AspectRatio ratio={16 / 9}>
          <img src={camp?.campBanner} className="rounded-lg  w-full h-full" />
        </AspectRatio>
        <h2 className="mt-5">{camp.campName}</h2>
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
      </div>
    </Link>
  );
}

export default Camp;
