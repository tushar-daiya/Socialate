import React from "react";
import { TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DotsVerticalIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useAcceptVolunteerMutation } from "@/redux/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import moment from "moment";
import { DialogDescription } from "@radix-ui/react-dialog";

function VolunteerTableItem({ volunteer }) {
  console.log(volunteer)
  const [modalOpen, setModalOpen] = useState(false);
  console.log(volunteer);
  const [acceptVolunteer, { isLoading, isError, isSuccess, error, data }] =
    useAcceptVolunteerMutation();
  useEffect(() => {
    if (isSuccess) {
      setModalOpen(false);
      toast.success("Volunteer accepted successfully");
    }
    if (isError) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [isLoading]);
  return (
    <TableRow>
      {volunteer?.status && (
        <TableCell className="capitalize">
          <Badge
            variant={`${volunteer.status == "pending" ? "default" : "success"}`}
          >
            {volunteer.status}
          </Badge>
        </TableCell>
      )}
      {volunteer?.user?.fullName && (
        <TableCell>{volunteer?.user?.fullName}</TableCell>
      )}
      {volunteer?.user?.phone && (
        <TableCell>{volunteer?.user?.phone}</TableCell>
      )}
      {volunteer?.camp?.campName && (
        <TableCell>
          <Link to={`/camp/${volunteer?.camp?._id}`}>
            {volunteer?.camp?.campName}
          </Link>
        </TableCell>
      )}
      {volunteer?.camp?.campTiming && (
        <TableCell>
          {moment(volunteer?.camp?.campTiming).format("Do MMM YY")}
        </TableCell>
      )}

      <TableCell>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={volunteer?.status == "accepted"}
              variant="outline"
            >
              Accept Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Accept volunteer</DialogHeader>
            <DialogDescription>
              Are you sure you want to accept this volunteer?
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  acceptVolunteer({
                    userId: volunteer?.user?._id,
                    campId: volunteer?.camp?._id,
                  });
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export default VolunteerTableItem;
