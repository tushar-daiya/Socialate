import { DateTimePicker } from "@/components/DatetimePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCampMutation,
  useGenerateCampDescriptionMutation,
} from "@/redux/api/authApi";
import { selectNgo } from "@/redux/features/ngo/ngoSlice";
import { Pencil1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { Formik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
function CreateCamp() {
  const navigate = useNavigate();
  const ngo = useSelector(selectNgo);
  const [createCamp, { data, error, isLoading, isSuccess }] =
    useCreateCampMutation();
  const [
    generateCampDescription,
    {
      data: generatedDescription,
      error: generatedDescriptionError,
      isLoading: generatedDescriptionLoading,
    },
  ] = useGenerateCampDescriptionMutation();
  const [campDescription, setCampDescription] = React.useState("");
  const [campDescriptionError, setCampDescriptionError] = React.useState(null);
  const [campDes, setCampDes] = React.useState("");
  const imageInput = React.useRef(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [bannerError, setBannerError] = React.useState(null);
  const [campDate, setCampDate] = React.useState();
  const [campDateError, setCampDateError] = React.useState(null);
  const handleBanner = (e) => {
    if (!e.target.files[0]) return;
    if (
      e.target.files[0].type === "image/png" ||
      e.target.files[0].type === "image/jpeg"
    ) {
      if (e.target.files[0].size > 200000) {
        setBannerError("Image size should be less than 200kb");
        return;
      }
      setBannerError("");
      setBanner(e.target.files[0]);
    } else {
      setBannerError("Only jpg and png files are allowed");
    }
  };

  

  const CampSchema = yup.object().shape({
    campName: yup.string().required("Camp Name is required"),
    street: yup.string().required("Camp Street is required"),
    city: yup.string().required("Camp City is required"),
    state: yup.string().required("Camp State is required"),
    pincode: yup.string().required("Camp Pincode is required"),
    campContact: yup.string().required("Camp Contact is required"),
    campEmail: yup.string().required("Camp Email is required"),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Camp Created Successfully");
      navigate(`/camp/${data?.data?._id}`);
    }
    if (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [isLoading]);

  useEffect(() => {
    if (generatedDescription) {
      console.log(generatedDescription)
      setCampDescription(generatedDescription?.data);
      setModalOpen(false);
    }
    if (generatedDescriptionError) {
      toast.error("Something went wrong");
    }
  }
  , [generatedDescriptionLoading]);

  return (
    <div>
      <h1>Create Camp</h1>
      <div className="mt-5">
        <h3 className="text-xl font-semibold">
          Banner Image{" "}
          <span className="text-gray-500">
            (Max Size: 200kb; aspect ratio: 1200x300px)
          </span>
        </h3>
        <div className="mt-1 relative">
          <div className="absolute flex items-center justify-center z-50  w-full h-full">
            <Button onClick={() => imageInput.current.click()}>
              <Pencil1Icon className="mr-2" /> Upload Banner
              <input
                onChange={handleBanner}
                ref={imageInput}
                type="file"
                className="hidden"
                accept="image/jpeg, image/png"
              />
            </Button>
          </div>
          <img
            src={
              banner ? URL.createObjectURL(banner) : "/bannerplaceholder.webp"
            }
            className="w-full aspect-[4/1] opacity-40 rounded-lg"
            alt="htllo"
          />
          {bannerError && <p className="text-red-500">{bannerError}</p>}
        </div>
      </div>
      <div>
        <Formik
          initialValues={{
            campName: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            campContact: "",
            campEmail: "",
          }}
          validationSchema={CampSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            console.log("hello");
            if (!banner && !bannerError) {
              setBannerError("Banner is required");
              return;
            }
            if (bannerError) return;
            if (!campDate && !campDateError) {
              setCampDateError("Camp Date is required");
              return;
            }
            if(campDescription.length<50){
              setCampDescriptionError("Camp Description should be atleast 50 characters long");
            }
            if(campDescriptionError) return;
            if (campDateError) return;
            const formData = new FormData();
            formData.append("banner", banner);
            formData.append("campName", values.campName);
            formData.append("campTiming", campDate);
            formData.append("campDescription", campDescription);
            formData.append("street", values.street);
            formData.append("city", values.city);
            formData.append("state", values.state);
            formData.append("pincode", values.pincode);
            formData.append("campPhone", values.campContact);
            formData.append("campEmail", values.campEmail);
            formData.append("campNgo", ngo._id);
            await createCamp(formData);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="mt-5 grid-cols-2 grid gap-5 divide-x-2">
                <div>
                  <div className="w-full mt-5">
                    <Label htmlFor="campName">Camp Name</Label>
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.campName}
                      type="text"
                      id="campName"
                      placeholder="Camp Name"
                    />
                    {errors?.campName && touched?.campName && (
                      <p className="text-red-500 mt-1">{errors.campName}</p>
                    )}
                  </div>
                  <div className="w-full mt-5">
                    <Label htmlFor="campDescription">Camp Description</Label>
                    <Textarea
                      className="h-40"
                      onChange={(e)=>setCampDescription(e.target.value)}
                      value={campDescription}
                      type="text"
                      id="campDescription"
                      placeholder="Tell us about your camp"
                    />
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" className="mt-5">
                          Generate Using AI
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          Generate description using AI
                        </DialogHeader>
                        <DialogDescription>
                          <Input
                            type="text"
                            id="campdes"
                            onChange={(e) => setCampDes(e.target.value)}
                            value={campDes}
                            placeholder="Write a line about your camp"
                          />
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() => {
                              generateCampDescription({ input: campDes });
                            }}
                            className="bg-red-500"
                          >
                            Generate
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                  </div>
                  <div className="flex mt-5 gap-5">
                    <div className="w-1/2">
                      <Label htmlFor="campEmail">Camp Email</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.campEmail}
                        type="text"
                        id="campEmail"
                        placeholder="Camp Email"
                      />
                      {errors?.campEmail && touched?.campEmail && (
                        <p className="text-red-500 mt-1">{errors.campEmail}</p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="campContact">Camp Contact</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.campContact}
                        type="text"
                        id="campContact"
                        placeholder="Camp Contact"
                      />
                      {errors?.campContact && touched?.campContact && (
                        <p className="text-red-500 mt-1">
                          {errors.campContact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pl-5">
                  <div className="w-full mt-5">
                    <Label className="block mb-2" htmlFor="campDate">
                      Camp Date
                    </Label>
                    <DateTimePicker date={campDate} setDate={setCampDate} />
                  </div>
                  <div className="w-full mt-5 flex gap-5">
                    <div className="w-1/2">
                      <Label htmlFor="street">Street Line</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.street}
                        type="text"
                        id="street"
                        placeholder="Street"
                      />
                      {errors?.street && touched?.street && (
                        <p className="text-red-500 mt-1">{errors.street}</p>
                      )}
                    </div>

                    <div className="w-1/2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.city}
                        type="text"
                        id="city"
                        placeholder="City"
                      />
                      {errors?.city && touched?.city && (
                        <p className="text-red-500 mt-1">{errors.city}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full mt-5 flex gap-5">
                    <div className="w-1/2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.state}
                        type="text"
                        id="state"
                        placeholder="state"
                      />
                      {errors?.state && touched?.state && (
                        <p className="text-red-500 mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div className="w-1/2">
                      <Label htmlFor="pincode">pincode</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.pincode}
                        type="number"
                        id="pincode"
                        placeholder="Pincode"
                      />
                      {errors?.pincode && touched?.pincode && (
                        <p className="text-red-500 mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button disabled={isSubmitting} type="submit" className="mt-10">
                {isSubmitting ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Camp"
                )}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateCamp;
