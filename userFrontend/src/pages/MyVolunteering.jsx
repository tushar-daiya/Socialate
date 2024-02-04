import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useGetMyVolunteeringQuery,
  useRemoveVolunteerMutation,
} from "@/redux/api/allApi";

function MyVolunteering() {
  const { isError, isLoading, isSuccess, data } = useGetMyVolunteeringQuery();
  const [
    removeVolunteering,
    {
      isError: rvisError,
      isLoading: rvisLoading,
      isSuccess: rvisSuccess,
      error: rvError,
      data: rvData,
    },
  ] = useRemoveVolunteerMutation();

  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    if (rvisSuccess) {
      toast.success(rvData?.message);
    }
    if (rvisError) {
      toast.error(rvError?.data?.message);
    }
  }, [rvisLoading]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-10">My volunteering</h1>
      {data?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">No volunteering found</h1>
          </div>
          <div>
            <Link to="/dashboard/camps">
              <Button variant="outline">Find camps</Button>
            </Link>
          </div>
        </div>
      )}

      {data?.data?.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camp</TableHead>
              <TableHead>Camp Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((volunteer) => (
              <TableRow key={volunteer?._id}>
                <TableCell>
                  <Link to={`/dashboard/camp/${volunteer?.camp?._id}`}>
                    {volunteer?.camp?.campName}
                  </Link>
                </TableCell>
                <TableCell>
                  {moment(volunteer?.camp?.campTiming).format("MMM DD YYYY")}
                </TableCell>
                <TableCell>
                  <Badge variant={`${volunteer.status == "pending" ? "default" : "success"}`} className="capitalize">{volunteer?.status}</Badge>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <MoreVertical />
                    </PopoverTrigger>
                    <PopoverContent className="w-max p-0">
                      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Remove application</Button>
                        </DialogTrigger>
                        <DialogContent>
                          Are you sure you want to remove your application?
                          <div className="flex justify-end mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={async () => {
                                await removeVolunteering(volunteer?.camp?._id);
                                setModalOpen(false);
                              }}
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default MyVolunteering;
