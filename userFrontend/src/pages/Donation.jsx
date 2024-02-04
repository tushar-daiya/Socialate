import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { selectUser } from "@/redux/features/user/userSlice";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDonateMutation, useGetCampByIdQuery } from "@/redux/api/allApi";

function Donation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isError, isLoading, isSuccess, data } = useGetCampByIdQuery(id);
  const [
    donate,
    {
      isError: disError,
      isLoading: disLoading,
      isSuccess: disSuccess,
      data: ddata,
      error: derror,
    },
  ] = useDonateMutation();
  const [errors, setErrors] = useState({});
  const user = useSelector(selectUser);
  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    unit: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
  });
  useEffect(() => {
    if (disSuccess) {
      toast.success("Donated");
      navigate("/dashboard/camp/" + id);
    }
    if (disError) {
      toast.error(derror?.data?.message);
    }
  }, [disLoading]);
  const [file, setFile] = useState(null);
  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error</div>;
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.foodName) errors.foodName = "Food name is required";
    if (!form.quantity) errors.quantity = "Quantity is required";
    if (!form.unit) errors.unit = "Unit is required";
    if (!file) errors.file = "File is required";
    if (!form.state) errors.state = "State is required";
    if (!form.city) errors.city = "City is required";
    if (!form.pincode) errors.pincode = "Pincode is required";
    if (!form.street) errors.street = "Street is required";
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const formData = new FormData();
    let foodQuantity = form.quantity + " " + form.unit;
    formData.append("foodName", form.foodName);
    formData.append("foodQuantity", foodQuantity);
    formData.append("foodImage", file);
    formData.append("donatedTo", id);
    formData.append("donatedBy", user?._id);
    formData.append("amount", 0);
    formData.append("street", form.street);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("pincode", form.pincode);

    await donate(formData);
  };
  return (
    <div>
      <Card className="max-w-2xl mx-auto border-white border border-solid">
        <div className="p-4">
          <h1>Donate Food</h1>
          <form onSubmit={handleSubmit}>
            <div className="w-full mt-5">
              <Label htmlFor="email">Camp</Label>
              <Input disabled value={data?.data?.campName} />
            </div>

            <div className="w-full mt-5">
              <Label htmlFor="password">Food Title</Label>
              <Input
                onChange={handleChange}
                value={form.foodName}
                type="text"
                id="foodName"
                placeholder="Food Title"
              />
              {errors?.foodName && (
                <p className="text-red-500 mt-1">{errors.foodName}</p>
              )}
            </div>
            <div className="w-full mt-5 flex gap-5">
              <div className="w-2/3">
                <Label htmlFor="password">Quantity</Label>
                <Input
                  onChange={handleChange}
                  value={form.quantity}
                  type="number"
                  id="quantity"
                  placeholder="Food Quantity"
                />
                {errors?.quantity && (
                  <p className="text-red-500 mt-1">{errors.quantity}</p>
                )}
              </div>
              <div className="w-1/3">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  onValueChange={(e) =>
                    setForm((prev) => ({ ...prev, unit: e }))
                  }
                  defaultValue={form.unit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="serve">Serve</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors?.unit && (
                  <p className="text-red-500 mt-1">{errors.unit}</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />
              {errors?.file && (
                <p className="text-red-500 mt-1">{errors.file}</p>
              )}
            </div>
            <h3 className="mt-5 font-semibold">Pickup Address</h3>
            <div className="w-full mt-2 flex gap-5">
              <div className="w-1/2">
                <Label htmlFor="street">Street Line</Label>
                <Input
                  onChange={handleChange}
                  value={form.street}
                  type="text"
                  id="street"
                  placeholder="Street"
                />
                {errors?.street && (
                  <p className="text-red-500 mt-1">{errors.street}</p>
                )}
              </div>

              <div className="w-1/2">
                <Label htmlFor="city">City</Label>
                <Input
                  onChange={handleChange}
                  value={form.city}
                  type="text"
                  id="city"
                  placeholder="City"
                />
                {errors?.city && (
                  <p className="text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
            </div>
            <div className="w-full mt-5 flex gap-5">
              <div className="w-1/2">
                <Label htmlFor="state">State</Label>
                <Input
                  onChange={handleChange}
                  value={form.state}
                  type="text"
                  id="state"
                  placeholder="state"
                />
                {errors?.state && (
                  <p className="text-red-500 mt-1">{errors.state}</p>
                )}
              </div>

              <div className="w-1/2">
                <Label htmlFor="pincode">pincode</Label>
                <Input
                  onChange={handleChange}
                  value={form.pincode}
                  type="number"
                  id="pincode"
                  placeholder="Pincode"
                />
                {errors?.pincode && (
                  <p className="text-red-500 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <div className="w-full mt-5">
              <Button type="submit" className="w-full">
                {disLoading ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Donate"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default Donation;
