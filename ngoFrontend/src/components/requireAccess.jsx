import { authApi } from "@/redux/api/authApi";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function RequireAccess() {
  const { isFetching, isLoading, isError, isSuccess } =
    authApi.endpoints.getMe.useQuery(null, {
      skip: false,
      refetchOnMountOrArgChange: true,
    });

  if (isFetching || isLoading) {
    return <div>loading...</div>;
  }
  if (isSuccess) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} replace={true} />;
  }
}

export default RequireAccess;
