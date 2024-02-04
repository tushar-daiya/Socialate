import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoginUserMutation } from "@/redux/api/allApi";
import { Link } from "react-router-dom";
function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isError, error, data, isLoading, isSuccess }] =
    useLoginUserMutation();
  const SignupSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be 8 characters long")
      .required("Password is required"),
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged in");
      navigate("/dashboard");
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-5">
        <h1 className="text-center">Login</h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await loginUser(values);
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
                  Login
                </Button>
              </div>
              <div className="mt-2">
                  <p className="text-center">
                    New to socialate?{" "}
                    <Link to={"/signup"}>
                      <span className="text-blue-800 font-semibold">Sign up</span>
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

export default Login;
