import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { selectNgo } from "@/redux/features/ngo/ngoSlice";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Formik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as yup from "yup";
function Profile() {
  const ngo = useSelector(selectNgo);
    const [updateProfile,{isError,error,isLoading,isSuccess,data}]=useUpdateProfileMutation()
    useEffect(()=>{
        if(isSuccess){
            toast.success("Profile Updated")

        }
        if(isError){
            toast.success(error.data.message)
        }
    },[isLoading])
  const NgoSchema = yup.object().shape({
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pincode: yup.string().required("Pincode is required"),
    about: yup
      .string()
      .required("About is required")
      .min(100, "About must be a minimum of 100words"),
  });
  return (
    <div className="flex ">
      <div className="w-1/5 p-5">
        <img
          src={ngo?.logoUrl}
          className="w-full aspect-[1/1] rounded-full opacity-40"
          alt="htllo"
        />
      </div>
      <div className="w-4/5">
        <Formik
          initialValues={{
            street: ngo.address.street || "",
            city: ngo.address.city || "",
            state: ngo.address.city || "",
            pincode: ngo.address.pincode || "",
            about: ngo.about || "",
          }}
          validationSchema={NgoSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            console.log("hello");
            const formData = new FormData();
            formData.append("street", values.street);
            formData.append("city", values.city);
            formData.append("state", values.state);
            formData.append("pincode", values.pincode);
            formData.append("about", values.about);
            await updateProfile(formData)
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
              <div className="w-full mt-5">
                <Label htmlFor="name">Name of Ngo</Label>
                <Input disabled value={ngo.name} />
              </div>
              <div className="w-full mt-5 flex gap-5">
                <div className="w-1/2">
                  <Label htmlFor="email">Email</Label>
                  <Input disabled value={ngo.email} />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input disabled value={ngo.phone} />
                </div>
              </div>
              <div className="w-full mt-5">
                <Label htmlFor="about">About</Label>
                <Textarea
                  className="h-40"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.about}
                  type="text"
                  id="about"
                  placeholder="Tell us about your ngo"
                />
                {errors?.about && touched?.about && (
                  <p className="text-red-500 mt-1">{errors.about}</p>
                )}
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

              <div className="w-full mt-5">
                <Button disabled={isSubmitting} type="submit" className="">
                  {isSubmitting ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
