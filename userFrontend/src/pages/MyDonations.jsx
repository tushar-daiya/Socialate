import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { useGetMyDonationsQuery } from "@/redux/api/allApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function MyDonations() {
  const { isError, isFetching, isSuccess, data } = useGetMyDonationsQuery();
  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-10">My donations</h1>
      {data?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">No donations yet</h1>
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
              <TableHead>Donated To</TableHead>
              <TableHead>Food Title</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((donation) => (
              <TableRow key={donation?._id}>
                <TableCell>
                  <Link to={`/dashboard/camp/${donation?.donatedTo?._id}`}>
                    {donation?.donatedTo?.campName}
                  </Link>
                </TableCell>
                <TableCell>{donation?.foodName}</TableCell>
                <TableCell>{donation?.foodQuantity}</TableCell>
                <TableCell>
                  <Badge
                    variant={`${
                      donation.status == "pending" ? "default" : "success"
                    }`}
                  >
                    {donation?.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Info className="cursor-pointer" />
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default MyDonations;
