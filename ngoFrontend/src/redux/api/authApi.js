import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setNgo } from "../features/ngo/ngoSlice";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}` }),
  tagTypes: ["Camp"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/ngos/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/ngos/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(authApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutNgo: builder.mutation({
      query() {
        return {
          url: "/ngos/logout",
          credentials: "include",
        };
      },
    }),
    getMe: builder.query({
      query() {
        return {
          url: "/ngos/me",
          credentials: "include",
        };
      },
      transformResponse: (response) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setNgo(data));
        } catch (err) {
          dispatch(setNgo(null));
        }
      },
    }),
    updateProfile: builder.mutation({
      query(data) {
        return {
          url: "/ngos/editprofile",
          method: "PATCH",
          body: data,
          credentials: "include",
        };
      },
    }),
    createCamp: builder.mutation({
      query: (data) => ({
        url: "/camps/createcamp",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllDonations: builder.query({
      query: () => ({
        url: "/donations/getalldonations",
        credentials: "include",
      }),
    }),
    getAllVolunteers: builder.query({
      query: () => ({
        url: "/donations/getallvolunteers",
        credentials: "include",
      }),
    }),
    getAllCamps: builder.query({
      query: () => ({
        url: "/camps/getallcampsbyngo",
        method: "GET",
        credentials: "include",
      }),
    }),
    getCampById: builder.query({
      query: (id) => ({
        url: `/camps/getcampbyid/${id}`,
        credentials: "include",
      }),
      providesTags: ["Camp"],
    }),
    editCamp: builder.mutation({
      query: ({ data, id }) => ({
        url: `/camps/editcamp/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Camp"],
    }),
    changeStatus: builder.mutation({
      query: ({ data, id }) => ({
        url: `/donations/changestatus/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),
    acceptVolunteer: builder.mutation({
      query: (data) => ({
        url: `/donations/acceptvolunteer`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),
    generateCampDescription: builder.mutation({
      query: (data) => ({
        url: `/camps/generatecampdescription`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useCreateCampMutation,
  useGetAllDonationsQuery,
  useGetAllCampsQuery,
  useGetCampByIdQuery,
  useEditCampMutation,
  useLogoutNgoMutation,
  useUpdateProfileMutation,
  useChangeStatusMutation,
  useGetAllVolunteersQuery,
  useAcceptVolunteerMutation,
  useGenerateCampDescriptionMutation,
} = authApi;
