import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [login, { isError, isLoading, isSuccess, data, error }] =
    useLoginMutation();
  const SignupSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be atleast 6 characters"),
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
      navigate("/");
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
            await login(values);

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
                  {isSubmitting ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
                <div className="mt-2">
                  <p className="text-center">
                    New to Socialate?{" "}
                    <Link to={"/register"}>
                      <span className="text-blue-800 font-semibold">Register</span>
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

export default Login;
