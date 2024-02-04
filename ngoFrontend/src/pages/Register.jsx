import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [register, { isError, isLoading, isSuccess, data, error }] =
    useRegisterMutation();
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const SignupSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone: yup.string().required("Phone is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be atleast 6 characters"),
    certificateId: yup.string().required("Certificate Id is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pincode: yup.string().required("Pincode is required"),
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
      navigate("/login");
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isLoading]);
  const handleImage = (e) => {
    if (!e.target.files[0]) return;
    if (
      e.target.files[0].type === "image/png" ||
      e.target.files[0].type === "image/jpeg"
    ) {
      if (e.target.files[0].size > 200000) {
        setImageError("Image size should be less than 200kb");
        return;
      }
      setImageError("");
      setImage(e.target.files[0]);
    } else {
      setImageError("Only jpg and png files are allowed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-5">
        <h1 className="text-center">Register</h1>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            password: "",
            certificateId: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (!image && !imageError) {
              setImageError("Image is required");
              return;
            }
            if (imageError) return;
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("password", values.password);
            formData.append("certificateId", values.certificateId);
            formData.append("street", values.street);
            formData.append("city", values.city);
            formData.append("state", values.state);
            formData.append("pincode", values.pincode);
            formData.append("logo", image);
            await register(formData);

            setSubmitting(false);
            // resetForm();
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
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  type="text"
                  id="name"
                  placeholder="Name of Ngo"
                />
                {errors?.name && touched?.name && (
                  <p className="text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div className="w-full mt-5 flex gap-5">
                <div className="w-1/2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    type="email"
                    id="email"
                    placeholder="Email"
                  />
                  {errors?.email && touched?.email && (
                    <p className="text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    type="number"
                    id="phone"
                    placeholder="Phone"
                  />
                  {errors?.phone && touched?.phone && (
                    <p className="text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="w-full mt-5">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  type="password"
                  id="password"
                  placeholder="***********"
                />
                {errors?.password && touched?.password && (
                  <p className="text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              <div className="w-full mt-5">
                <Label htmlFor="certificateId">Certificate Id</Label>
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.certificateId}
                  type="text"
                  id="certificateId"
                  placeholder="***********"
                />
                {errors?.certificateId && touched?.certificateId && (
                  <p className="text-red-500 mt-1">{errors.certificateId}</p>
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
                  <Label htmlFor="pincode">Pincode</Label>
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
                <Label htmlFor="image">Logo</Label>
                <Input id="image" onChange={handleImage} type="file" />
                {imageError && (
                  <p className="text-red-500 mt-1">{imageError}</p>
                )}
              </div>
              <div className="w-full mt-5">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting?<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />:"Register"}
                </Button>
                <div className="mt-2">
                  <p className="text-center">
                    Already registered?{" "}
                    <Link to={"/login"}>
                      <span className="text-blue-800 font-semibold">Login</span>
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
