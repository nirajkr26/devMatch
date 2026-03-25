import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constant";

/**
 * RTK Query API Slice
 * Centralizes all data fetching logic, providing automatic caching, 
 * loading states, and error handling for the entire application.
 */
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["Feed", "Connections", "Requests", "User", "Chat"],
    endpoints: (builder) => ({
        // User Profile
        getProfile: builder.query({
            query: () => ({
                url: "/profile/view",
                credentials: "include",
            }),
            providesTags: ["User"],
        }),

        // Discover Developers (Feed)
        getFeed: builder.query({
            query: () => ({
                url: "/feed",
                credentials: "include",
            }),
            providesTags: ["Feed"],
        }),

        // Connection Management
        getConnections: builder.query({
            query: () => ({
                url: "/user/connections",
                credentials: "include",
            }),
            providesTags: ["Connections"],
        }),

        // Request Management
        getRequests: builder.query({
            query: () => ({
                url: "/user/requests/received",
                credentials: "include",
            }),
            providesTags: ["Requests"],
        }),

        // Chat History
        getChat: builder.query({
            query: (targetUserId) => ({
                url: `/chat/${targetUserId}`,
                credentials: "include",
            }),
            transformResponse: (response) => {
                return response?.messages?.map((msg) => ({
                    senderId: msg?.senderId?._id,
                    firstName: msg?.senderId?.firstName,
                    lastName: msg?.senderId?.lastName,
                    photoUrl: msg?.senderId?.photoUrl,
                    text: msg?.text,
                    createdAt: msg?.createdAt
                })) || [];
            },
            providesTags: (result, error, arg) => [{ type: "Chat", id: arg }],
        }),

        // Mutations (Actions that change data)
        sendConnectionRequest: builder.mutation({
            query: ({ status, userId }) => ({
                url: `/request/send/${status}/${userId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Feed", "Connections"],
        }),

        reviewConnectionRequest: builder.mutation({
            query: ({ status, requestId }) => ({
                url: `/request/review/${status}/${requestId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Requests", "Connections", "Feed"],
        }),

        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: "/profile/edit",
                method: "PATCH",
                body: profileData,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useGetFeedQuery,
    useGetConnectionsQuery,
    useGetRequestsQuery,
    useGetChatQuery,
    useSendConnectionRequestMutation,
    useReviewConnectionRequestMutation,
    useUpdateProfileMutation
} = apiSlice;
