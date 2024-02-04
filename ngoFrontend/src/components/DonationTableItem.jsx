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
import { useChangeStatusMutation } from "@/redux/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";

function DonationTableItem({ donation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const status = ["pending", "accepted", "pickedup", "distributed"];
  const [selectedStatus, setSelectedStatus] = useState(donation?.status);
  const isOptionDisabled = (optionValue) => {
    if (selectedStatus === "accepted" && optionValue === "pending") {
      return true;
    } else if (
      selectedStatus === "pickedup" &&
      (optionValue === "accepted" || optionValue === "pending")
    ) {
      return true;
    } else if (
      selectedStatus === "distributed" &&
      (optionValue === "accepted" ||
        optionValue === "pickedup" ||
        optionValue === "pending")
    ) {
      return true;
    }

    return false;
  };
  const [changeStatus, { isError, isLoading, error, isSuccess, data }] =
    useChangeStatusMutation();
  useEffect(() => {
    if (isSuccess) {
      setModalOpen(false);
      toast.success("Status changed successfully");
    }
    if (isError) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [isLoading]);
  return (
    <TableRow key={donation?._id}>
      {donation?.status && (
        <TableCell className="capitalize">
          <Badge
            variant={`${donation.status == "pending" ? "default" : "success"}`}
          >
            {donation.status}
          </Badge>
        </TableCell>
      )}
      {donation?.foodName && <TableCell>{donation?.foodName}</TableCell>}
      {donation?.foodQuantity && (
        <TableCell>{donation?.foodQuantity}</TableCell>
      )}
      {donation?.donatedTo?.campName && (
        <TableCell>
          <Link to={`/camp/${donation?.donatedTo?._id}`}>
            {donation?.donatedTo?.campName}
          </Link>
        </TableCell>
      )}
      {donation?.donatedBy?.fullName && (
        <TableCell>
          <Link to={`/user/${donation?.donatedBy?._id}`}>
            {donation?.donatedBy?.fullName}
          </Link>
        </TableCell>
      )}
      {donation?.additionalInfo && (
        <TableCell>
          <Dialog>
            <DialogTrigger asChild>
              <InfoCircledIcon className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-full p-8 overflow-scroll max-h-[calc(100dvh-40px)]">
              <img
                src={donation?.foodImage}
                className="aspect-square sm:max-w-96 w-full"
                alt="foodImage"
              />
              <p>{donation?.additionalInfo}</p>
            </DialogContent>
          </Dialog>
        </TableCell>
      )}
      {donation?.status && (
        <TableCell>
          {/* <Popover>
          <PopoverTrigger>
            <DotsVerticalIcon className="cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-max p-0"> */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Change Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Change status</DialogHeader>
              <div>
                <Select
                  onValueChange={(e) => {
                    setSelectedStatus(e);
                  }}
                  defaultValue={donation.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {status.map((item) => (
                        <SelectItem
                          disabled={isOptionDisabled(item)}
                          key={item}
                          value={item}
                          className="capitalize"
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    changeStatus({
                      data: { status: selectedStatus },
                      id: donation._id,
                    });
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* </PopoverContent>
        </Popover> */}
        </TableCell>
      )}
    </TableRow>
  );
}

export default DonationTableItem;
