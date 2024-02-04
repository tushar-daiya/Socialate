import { selectUser } from "@/redux/features/user/userSlice";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLogoutUserMutation } from "@/redux/api/allApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [modalOpen,setModalOpen]=useState(false)
  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation();
  useEffect(() => {
    if (isSuccess) {
      window.location.href = "/login";
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isLoading]);

  return (
    <div className="w-1/6 h-screen fixed bg-[rgba(23,23,23,1)] flex flex-col py-10 items-center justify-between">
      <h1 className="flex gap-2 items-center text-white">
        <img src="../logo.png" width={40} height={40} />
        Socialate
      </h1>
      <ul className="flex w-4/5 gap-5 flex-col">
        <Link to={"/dashboard"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Ngos
          </li>
        </Link>
        <Link to={"/dashboard/camps"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Donation Camps
          </li>
        </Link>
        <Link to={"/dashboard/my-donations"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            My donations
          </li>
        </Link>
        <Link to={"/dashboard/my-volunteering"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            My volunteering
          </li>
        </Link>
      </ul>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-4/5 bg-red-500">Logout</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Logout</DialogHeader>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                logoutUser();
              }}
              className="bg-red-500"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Navbar;
