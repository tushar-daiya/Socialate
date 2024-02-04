import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center w-full h-screen justify-center">
      <img
        src="/background.jpeg"
        className="w-full h-screen absolute top-0 left-0"
        alt="Banner"
      />

      <div className="z-50 flex flex-col gap-5 items-center justify-center">
        <h1 className="font-bold text-9xl hover:text-blue-300 transition-colors  text-white ">
          Let's Socialate
        </h1>
        <h2 className="font-bold text-5xl hover:text-blue-300 transition-colors  text-white ">
          Let's contribute
        </h2>
        <div className="flex gap-5">
          <Button
            className="text-xl px-5 rounded-lg bg-white text-black hover:bg-blue-500 transition-colors"
            onClick={() => navigate("/login")}
          >
            Contributor
          </Button>
          <Button
            className="text-xl px-5 rounded-lg bg-white text-black hover:bg-blue-500 transition-colors"
            onClick={() => navigate("/login")}
          >
            Ngo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
