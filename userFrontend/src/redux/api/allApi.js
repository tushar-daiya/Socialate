import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/user/userSlice";

export const allApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/`,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query(data) {
        return {
          url: "users/register",
          method: "POST",
          body: data,
        };
      },
    }),
    loginUser: builder.mutation({
      query(data) {
        return {
          url: "users/login",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(allApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query() {
        return {
          url: "users/logout",
          credentials: "include",
        };
      },
    }),
    getMe: builder.query({
      query() {
        return {
          url: "users/me",
          credentials: "include",
        };
      },
      transformResponse: (response) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (err) {
          dispatch(setUser(null));
        }
      },
    }),
    getNgoById: builder.query({
      query(id) {
        return {
          url: `ngos/getngobyid/${id}`,
          credentials: "include",
        };
      },
    }),
    getNgo: builder.query({
      query() {
        return {
          url: "ngos/getallngos",
          credentials: "include",
        };
      },
    }),
    getNgoById: builder.query({
      query(id) {
        return {
          url: `ngos/getngobyid/${id}`,
          credentials: "include",
        };
      },
    }),
    getCampById: builder.query({
      query(id) {
        return {
          url: `camps/getcampbyid/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Camp"],
    }),
    getAllCamps: builder.query({
      query() {
        return {
          url: `camps/getallcamps`,
          credentials: "include",
        };
      },
      providesTags: ["Camp"],
    }),
    donate: builder.mutation({
      query(data) {
        return {
          url: `donations/donate`,
          method: "POST",
          credentials: "include",
          body: data,
        };
      },
    }),
    applyasVolunteer: builder.mutation({
      query(id) {
        return {
          url: `donations/applyvolunteer/${id}`,
          method: "PATCH",
          credentials: "include",
        };
      },
    }),
    removeVolunteer: builder.mutation({
        query(id){
          return{
            url: `donations/removevolunteerapplication/${id}`,
            method: "PATCH",
            credentials: "include",
          }
        }
    }),
    getMyDonations: builder.query({
      query() {
        return {
          url: `donations/getuserdonations`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
    getMyVolunteering: builder.query({
      query() {
        return {
          url: `donations/getmyvolunteering`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Volunteering"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useGetNgoQuery,
  useGetNgoByIdQuery,
  useGetCampByIdQuery,
  useGetAllCampsQuery,
  useDonateMutation,
  useGetMyDonationsQuery,
  useGetMyVolunteeringQuery,
  useApplyasVolunteerMutation,
  useRemoveVolunteerMutation
} = allApi;
