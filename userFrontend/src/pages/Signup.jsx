import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRegisterUserMutation } from "@/redux/api/allApi";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [registerUser, { isError, error, data, isLoading, isSuccess }] =
    useRegisterUserMutation();
  const SignupSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid Email").required("Email is required"),
    phone: yup.number().required("Phone is required"),
    password: yup
      .string()
      .min(8, "Password must be 8 characters long")
      .required("Password is required"),
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success("Registered Successfully");
      navigate("/login");
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-5">
        <h1 className="text-center">Signup</h1>
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await registerUser(values);
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullName}
                  type="text"
                  id="fullName"
                  placeholder="Tushar Daiya"
                />
                {errors?.fullName && touched?.fullName && (
                  <p className="text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>
              <div className="w-full mt-5">
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
              <div className="w-full mt-5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  type="number"
                  id="phone"
                  placeholder="9999999999"
                />
                {errors?.phone && touched?.phone && (
                  <p className="text-red-500 mt-1">{errors.phone}</p>
                )}
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
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isLoading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Signup"
                  )}
                </Button>
              </div>
              <div className="mt-2">
                  <p className="text-center">
                    Already a user?{" "}
                    <Link to={"/login"}>
                      <span className="text-blue-800 font-semibold">Login</span>
                    </Link>
                  </p>
                </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Signup;
