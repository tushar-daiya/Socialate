import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNgo } from "@/redux/features/ngo/ngoSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLogoutNgoMutation } from "@/redux/api/authApi";
import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

function Navbar() {
  const [logoutNgo, { isError, isLoading, isSuccess, data }] =
    useLogoutNgoMutation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  useEffect(() => {
    if (isSuccess) {
      window.location.href = "/login";
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isLoading]);
  const ngo = useSelector(selectNgo);
  return (
    <div className="w-1/6 h-screen fixed bg-[rgba(23,23,23,1)] flex flex-col py-10 items-center justify-between">
      <h1 className="flex gap-2 items-center text-white">
        <img src="./logo.png" width={40} height={40} />
        Socialate
      </h1>
      <ul className="flex w-4/5 gap-5 flex-col">
        <Link to={"/"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            My Camps
          </li>
        </Link>
        <Link to={"/donations"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Donations
          </li>
        </Link>
        <Link to={"/volunteers"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Volunteers
          </li>
        </Link>
        <Link to={"/createcamp"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Create Camp
          </li>
        </Link>
        <Link to={"/profile"} className="text-white">
          <li className="p-4 hover:bg-blue-800 transition-colors bg-slate-800 rounded-lg w-full">
            Profile
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
                logoutNgo();
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
