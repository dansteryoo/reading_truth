import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ROOT_URL } from 'App';
import {
  addRating,
  logoutUser,
  setCredentials,
  setOnDemandCourse,
  setUser,
  setUserPhoto,
  toggleOptIn,
} from 'features/auth/slice';

const baseQuery = fetchBaseQuery({
  baseUrl: ROOT_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery('/auth', api, extraOptions);
    if (refreshResult.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult.data));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutUser());
    }
  }
  return result;
};

const providesTagsHelper = ({ type, result }) =>
  result ? [...result.map(({ _id: id }) => ({ type, id }))] : [type];

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Session',
    'Partner',
    'Group',
    'Course',
    'Trainer',
    'AuthUser',
    'FileModule',
  ],
  endpoints: (builder) => ({
    // auth / user endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    getAuthUser: builder.query({
      query: () => '/auth',
      providesTags: ['AuthUser'],
    }),
    impersonateUser: builder.mutation({
      query: (id) => ({
        url: `/auth/impersonate?id=${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Session', 'Group', 'Course', 'Trainer'],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `/users/${user._id}`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['AuthUser'],
    }),
    updateUserField: builder.mutation({
      async queryFn(field, { getState, dispatch }, _extraOptions, fetchWithBQ) {
        const userId = getState().auth.user._id;
        const res = await fetchWithBQ({
          url: `/users/update_user/${field}/${userId}`,
          method: 'POST',
        });

        if (res.data) {
          dispatch(toggleOptIn(field));
          return { data: res.data };
        } else {
          return { error: res.error };
        }
      },
    }),
    adminResetPassword: builder.mutation({
      query: (id) => ({
        url: `/users/resend_invitation_email/${id}`,
        method: 'POST',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/auth/reset_password/${token}`,
        method: 'POST',
        body,
      }),
    }),
    updateUserPassword: builder.mutation({
      query: (user) => ({
        url: `/auth/change_password`,
        method: 'POST',
        body: user,
      }),
    }),
    validateRecaptcha: builder.query({
      query: (token) => ({
        url: '/auth/recaptcha',
        method: 'POST',
        body: { token },
      }),
    }),
    getResetToken: builder.mutation({
      query: ({ email, referrer }) => ({
        url: `/auth/getResetToken${referrer ? `?referrer=${referrer}` : ''}`,
        method: 'POST',
        body: { email: email.toLowerCase() },
      }),
    }),
    signUp: builder.mutation({
      query: (user) => ({
        url: '/users/self-signup',
        method: 'POST',
        body: user,
      }),
    }),
    updateUserInfo: builder.mutation({
      query: (user) => ({
        url: `/auth/update_info/${user._id}`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['AuthUser'],
    }),
    updateUserPhoto: builder.mutation({
      async queryFn(file, { getState, dispatch }, _extraOptions, fetchWithBQ) {
        // generate the public id, timestamp, and signature
        const response = await fetchWithBQ({
          url: '/users/upload/image',
          method: 'POST',
          body: { data: file.path },
        });

        // set up the form data and upload file to cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('public_id', response.data.public_id);
        formData.append('api_key', '792777696515396');
        formData.append('timestamp', response.data.timestamp);
        formData.append('signature', response.data.signature);

        const startUpload = await fetch(
          'https://api.cloudinary.com/v1_1/dmwoxjusp/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const startUploadData = await startUpload.json();

        // update the user's photo in the db with the new url
        const updateUser = await fetchWithBQ({
          url: `/users/update_user/image`,
          method: 'POST',
          body: {
            url: startUploadData.secure_url,
            user: getState().auth.user._id,
          },
        });

        if (updateUser.data) {
          dispatch(setUserPhoto(updateUser.data.url));
          return { data: updateUser.data };
        } else {
          return { error: updateUser.error };
        }
      },
      invalidatesTags: ['AuthUser'],
    }),
    updateUserLanguage: builder.mutation({
      async queryFn(user, { dispatch }, _extraOptions, fetchWithBQ) {
        const response = await fetchWithBQ({
          url: `/auth/update_language/${user._id}`,
          method: 'POST',
          body: user,
        });

        if (response?.data?.user) {
          dispatch(setUser({ user: response.data.user }));
          return { data: response.data };
        } else {
          return { error: response?.error };
        }
      },
    }),
    updateUserCourse: builder.mutation({
      async queryFn(
        { courseId, ...updates },
        { dispatch },
        _extraOptions,
        fetchWithBQ
      ) {
        const response = await fetchWithBQ({
          url: `/users/courses/${courseId}`,
          method: 'POST',
          body: updates,
        });

        if (response?.data) {
          dispatch(setOnDemandCourse(response.data));
          return { data: response.data };
        } else {
          return { error: response?.error };
        }
      },
    }),
    updateUserCourseProgress: builder.mutation({
      async queryFn(
        { courseId, moduleId },
        { dispatch },
        _extraOptions,
        fetchWithBQ
      ) {
        const response = await fetchWithBQ({
          url: `/users/courses/${courseId}/progress/${moduleId}`,
          method: 'POST',
        });

        if (response?.data) {
          dispatch(setOnDemandCourse(response.data));
          return { data: response.data };
        } else {
          return { error: response?.error };
        }
      },
    }),
    // session/classes endpoints
    getSessions: builder.query({
      query: (query) => `/sessions${query ? `?${query}` : ''}`,
      providesTags: (result) => providesTagsHelper({ type: 'Session', result }),
    }),
    createSession: builder.mutation({
      query: (session) => ({
        url: '/sessions',
        method: 'POST',
        body: session,
      }),
      invalidatesTags: ['Session'],
    }),
    getSession: builder.query({
      query: (id) => `/sessions/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Session', id: result._id }] : [],
    }),
    updateSession: builder.mutation({
      query: (session) => ({
        url: `/sessions/${session._id}`,
        method: 'POST',
        body: session,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg._id },
      ],
    }),
    removeSession: builder.mutation({
      query: (sessionId) => ({
        url: `/sessions/remove/${sessionId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
    }),
    addSessionContent: builder.mutation({
      query: (id) => ({
        url: `/sessions/add_content/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg }],
    }),
    unlockSessionContent: builder.mutation({
      query: ({ id, content: { unlocked, module } }) => ({
        url: `/sessions/unlock_content/${id}`,
        method: 'POST',
        body: {
          unlocked,
          module,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg.id },
      ],
    }),
    removeUserFromSession: builder.mutation({
      query: ({ sessionId, userId }) => ({
        url: `/sessions/remove_user_from_session/${sessionId}/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg.sessionId },
      ],
    }),
    addUserToSession: builder.mutation({
      query: (body) => ({
        url: '/users/addUserToSession',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg.session },
      ],
    }),
    setSessionComplete: builder.mutation({
      query: (sessionId) => ({
        url: `/sessions/${sessionId}/complete`,
        method: 'POST',
      }),
    }),
    // trainer endpoints
    getTrainers: builder.query({
      query: (partnerId) => `/users/dropdowntrainers?partner=${partnerId}`,
      providesTags: (result) => providesTagsHelper({ type: 'Trainer', result }),
    }),
    // course endpoints
    getCoursesByTrainers: builder.query({
      query: (trainers = []) =>
        `/courses?searchable=true&trainers=${trainers
          .map(({ value }) => value)
          .toString()}`,
      providesTags: (result) => providesTagsHelper({ type: 'Course', result }),
    }),
    getCourses: builder.query({
      query: () => `/courses`,
      providesTags: (result) => providesTagsHelper({ type: 'Course', result }),
    }),
    getCoursesForLookup: builder.query({
      query: () => '/courses/lookup',
    }),
    getCourse: builder.query({
      query: (id) => ({
        url: `/courses/${id}`,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Course', id: result._id }] : [],
    }),
    addCourse: builder.mutation({
      query: ({ name, type }) => ({
        url: '/courses',
        method: 'POST',
        body: { name, type },
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/delete/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation({
      query: (course) => ({
        url: `/courses/${course._id}`,
        method: 'POST',
        body: course,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.course },
      ],
      // this onQueryStarted func optimistically updates the results of getCourse when updateCourse is called
      // if the network call fails, it reverts the results to the previous state
      async onQueryStarted({ _id, ...update }, { dispatch, queryFulfilled }) {
        const updateResult = dispatch(
          api.util.updateQueryData('getCourse', _id, (draft) => {
            Object.assign(draft, update);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          updateResult.undo();
        }
      },
    }),
    addCourseModule: builder.mutation({
      query: (module) => ({
        url: '/modules/create',
        method: 'POST',
        body: module,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.course },
      ],
    }),
    updateCourseSectionModules: builder.mutation({
      query: ({ id, sectionModule }) => ({
        url: `/courses/${id}/section_modules/${sectionModule.id}`,
        method: 'POST',
        body: sectionModule,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Course', id: arg.id }],
      // this onQueryStarted func optimistically updates the results of getCourse when updateCourseSectionModules is called
      // if the network call fails, it reverts the results to the previous state
      async onQueryStarted(
        { id, sectionModule },
        { dispatch, queryFulfilled }
      ) {
        const updateResult = dispatch(
          api.util.updateQueryData('getCourse', id, (course) => {
            const sectionIndex = course.modules.findIndex(
              ({ module_id: { _id } }) => _id === sectionModule.id
            );
            if (sectionIndex >= 0) {
              const section = course.modules[sectionIndex];
              course.modules.splice(sectionIndex, 1, {
                ...section,
                modules: sectionModule.modules,
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          updateResult.undo();
        }
      },
    }),
    // file module endpoints
    getFileModule: builder.query({
      query: (id) => `/FileModule/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'FileModule', id: result._id }] : [],
    }),
    // partner endpoints
    getPartners: builder.query({
      query: () => `/partners`,
      providesTags: (result) => providesTagsHelper({ type: 'Partner', result }),
    }),
    // client/group endpoints
    getGroups: builder.query({
      query: (partnerId) => `/groups?partner=${partnerId}`,
      providesTags: (result) => providesTagsHelper({ type: 'Group', result }),
    }),
    createGroup: builder.mutation({
      query: (group) => ({
        url: '/groups',
        method: 'POST',
        body: group,
      }),
      invalidatesTags: ['Group'],
    }),
    // reporting endpoints
    getRenewalReport: builder.query({
      query: () => `/reporting/renewal_data`,
    }),
    // invoice endpoints
    getInvoices: builder.query({
      query: () => '/invoices',
    }),
    getInvoiceSignedUrl: builder.query({
      query: (id) => `/invoices/signedUrl/${id}`,
    }),
    // rating endpoint
    createInstructorRating: builder.mutation({
      async queryFn(body, { dispatch }, _extraOptions, fetchWithBQ) {
        const response = await fetchWithBQ({
          url: '/ratings/instructor',
          method: 'POST',
          body,
        });

        if (response.data) {
          dispatch(addRating(response.data));
          return { data: response.data };
        } else {
          return { error: response?.error || 'Unknown error' };
        }
      },
    }),
  }),
});

export const {
  endpoints,
  // auth endpoints
  useImpersonateUserMutation,
  useLazyGetAuthUserQuery,
  useLazyValidateRecaptchaQuery,
  useLoginMutation,
  useAdminResetPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserMutation,
  useGetResetTokenMutation,
  useUpdateUserInfoMutation,
  useUpdateUserPhotoMutation,
  useUpdateUserFieldMutation,
  useSignUpMutation,
  useUpdateUserLanguageMutation,
  useUpdateUserCourseMutation,
  useUpdateUserCourseProgressMutation,
  // session endpoints
  useGetSessionsQuery,
  useLazyGetSessionsQuery,
  useCreateSessionMutation,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useRemoveSessionMutation,
  useAddSessionContentMutation,
  useUnlockSessionContentMutation,
  useRemoveUserFromSessionMutation,
  useAddUserToSessionMutation,
  useSetSessionCompleteMutation,
  // client/group endpoints
  useGetGroupsQuery,
  useCreateGroupMutation,
  // trainer endpoints
  useGetTrainersQuery,
  // course endpoints
  useGetCoursesByTrainersQuery,
  useGetCoursesQuery,
  useGetCoursesForLookupQuery,
  useGetCourseQuery,
  useAddCourseMutation,
  useAddCourseModuleMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseSectionModulesMutation,
  // file module endpoints
  useGetFileModuleQuery,
  // partner endpoints
  useGetPartnersQuery,
  // reporting endpoints
  useGetRenewalReportQuery,
  // invoice endpoints
  useGetInvoicesQuery,
  useGetInvoiceSignedUrlQuery,
  // rating endpoint
  useCreateInstructorRatingMutation,
} = api;
