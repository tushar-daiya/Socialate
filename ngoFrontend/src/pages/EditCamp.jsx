import { DateTimePicker } from "@/components/DatetimePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditCampMutation, useGetCampByIdQuery } from "@/redux/api/authApi";
import { selectNgo } from "@/redux/features/ngo/ngoSlice";
import { Pencil1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { Formik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
function EditCampComponent({ camp }) {
  const navigate = useNavigate();
  const ngo = useSelector(selectNgo);
  const [editCamp, { data, error, isLoading, isSuccess, isError }] =
    useEditCampMutation();
  const imageInput = React.useRef(null);
  const [banner, setBanner] = React.useState(camp?.campBanner);
  const [file, setFile] = React.useState();
  const [bannerError, setBannerError] = React.useState(null);
  const [campDate, setCampDate] = React.useState(new Date(camp?.campTiming));
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
      let url = URL.createObjectURL(e.target.files[0]);
      setFile(e.target.files[0]);
      setBannerError("");
      setBanner(url);
    } else {
      setBannerError("Only jpg and png files are allowed");
    }
  };
  const CampSchema = yup.object().shape({
    campName: yup.string().required("Camp Name is required"),
    campDescription: yup.string().required("Camp Description is required"),
    street: yup.string().required("Camp Street is required"),
    city: yup.string().required("Camp City is required"),
    state: yup.string().required("Camp State is required"),
    pincode: yup.string().required("Camp Pincode is required"),
    campPhone: yup.string().required("Camp Contact is required"),
    campEmail: yup.string().required("Camp Email is required"),
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success("Camp Edited");
      navigate(`/camp/${camp?._id}`);
    }
    if (isError) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [isLoading]);
  return (
    <div className="mt-5">
      <h1>Edit Camp</h1>
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
            src={banner}
            className="w-full aspect-[4/1] opacity-40"
            alt="htllo"
          />
          {bannerError && <p className="text-red-500">{bannerError}</p>}
        </div>
      </div>
      <div>
        <Formik
          initialValues={{
            campName: camp?.campName || "",
            campDescription: camp?.campDescription || "",
            street: camp?.campAddress.street || "",
            city: camp?.campAddress.city || "",
            state: camp?.campAddress.state || "",
            pincode: camp?.campAddress.pincode || "",
            campPhone: camp?.campPhone || "",
            campEmail: camp?.campEmail || "",
          }}
          validationSchema={CampSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (!banner && !bannerError) {
              setBannerError("Banner is required");
              return;
            }
            if (bannerError) return;
            if (!campDate && !campDateError) {
              setCampDateError("Camp Date is required");
              return;
            }
            if (campDateError) return;
            const formData = new FormData();
            if (banner != camp?.campBanner) {
              formData.append("banner", file);
              console.log("banner changed");
            }
            appendIfChanged(formData,"campTiming",campDate,camp?.campTiming)
            appendIfChanged(
              formData,
              "campName",
              values.campName,
              camp?.campName
            );
            appendIfChanged(
              formData,
              "campDescription",
              values.campDescription,
              camp?.campDescription
            );
            appendIfChanged(
              formData,
              "street",
              values.street,
              camp?.campAddress.street
            );
            appendIfChanged(
              formData,
              "city",
              values.city,
              camp?.campAddress.city
            );
            appendIfChanged(
              formData,
              "state",
              values.state,
              camp?.campAddress.state
            );
            appendIfChanged(
              formData,
              "pincode",
              values.pincode,
              camp?.campAddress.pincode
            );
            appendIfChanged(
              formData,
              "campPhone",
              values.campPhone,
              camp?.campPhone
            );
            appendIfChanged(
              formData,
              "campEmail",
              values.campEmail,
              camp?.campEmail
            );
            let id = camp?._id;
            await editCamp({
              data: formData,
              id,
            });
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.campDescription}
                      type="text"
                      id="campDescription"
                      placeholder="Tell us about your camp"
                    />
                    <Button type="button" className="mt-5">
                      Generate Using AI
                    </Button>
                    {errors?.campDescription && touched?.campDescription && (
                      <p className="text-red-500 mt-1">
                        {errors.campDescription}
                      </p>
                    )}
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
                      <Label htmlFor="campPhone">Camp Contact</Label>
                      <Input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.campPhone}
                        type="text"
                        id="campPhone"
                        placeholder="Camp Contact"
                      />
                      {errors?.campPhone && touched?.campPhone && (
                        <p className="text-red-500 mt-1">{errors.campPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pl-5">
                  <div className="w-full mt-5">
                    <Label className="block mb-2" htmlFor="campDate">
                      Camp Date
                    </Label>
                    <DateTimePicker
                      date={campDate}
                      setDate={setCampDate}
                    />
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
                  "Edit Camp"
                )}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function EditCamp() {
  const { id } = useParams();
  const { error, data, isLoading, isSuccess } = useGetCampByIdQuery(id);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  return <EditCampComponent camp={data?.data} />;
}

function appendIfChanged(formData, key, value, initialValue) {
  if (value !== initialValue) {
    formData.append(key, value);
  }
}

export default EditCamp;
