import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface FormField {
  id?: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'time' | 'select' | 'radio' | 'checkbox' | 'file';
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[];
  orderIndex?: number;
}

export interface FormTemplate {
  id: string;
  title: string;
  description?: string;
  type: 'CONSULTATION' | 'CONSENT' | 'INTAKE' | 'FOLLOW_UP' | 'FEEDBACK' | 'CUSTOM';
  fields: FormField[];
  isActive: boolean;
  submissionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  fieldName: string;
  value: string | string[];
}

export interface FormSubmission {
  id: string;
  formTemplateId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  responses: FormResponse[];
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  submittedAt: string;
  submittedBy?: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  formTemplate?: FormTemplate;
}

export interface CreateFormTemplateRequest {
  title: string;
  description?: string;
  type: 'CONSULTATION' | 'CONSENT' | 'INTAKE' | 'FOLLOW_UP' | 'FEEDBACK' | 'CUSTOM';
  fields: Omit<FormField, 'id'>[];
  isActive?: boolean;
}

export interface UpdateFormTemplateRequest extends Partial<CreateFormTemplateRequest> {}

export interface CreateFormSubmissionRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  responses: FormResponse[];
  notes?: string;
}

export interface UpdateFormSubmissionRequest {
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface FormsListResponse {
  templates: FormTemplate[];
  total: number;
  page: number;
  limit: number;
}

export interface SubmissionsListResponse {
  submissions: FormSubmission[];
  total: number;
  page: number;
  limit: number;
}

export interface FormStatistics {
  totalTemplates: number;
  totalSubmissions: number;
  pendingSubmissions: number;
}

// API Slice
export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/forms',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from state
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['FormTemplate', 'FormSubmission', 'FormStatistics'],
  endpoints: (builder) => ({
    // Form Templates
    createFormTemplate: builder.mutation<FormTemplate, CreateFormTemplateRequest>({
      query: (data) => ({
        url: '/templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FormTemplate', 'FormStatistics'],
    }),

    getFormTemplates: builder.query<FormsListResponse, {
      page?: number;
      limit?: number;
      type?: string;
      isActive?: boolean;
    }>({
      query: ({ page = 1, limit = 10, type, isActive }) => ({
        url: '/templates',
        params: { page, limit, type, isActive },
      }),
      providesTags: ['FormTemplate'],
    }),

    getFormTemplate: builder.query<FormTemplate, string>({
      query: (id) => `/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'FormTemplate', id }],
    }),

    getPublicFormTemplate: builder.query<FormTemplate, string>({
      query: (id) => `/public/${id}`,
    }),

    updateFormTemplate: builder.mutation<FormTemplate, { id: string; data: UpdateFormTemplateRequest }>({
      query: ({ id, data }) => ({
        url: `/templates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FormTemplate', id },
        'FormTemplate',
        'FormStatistics',
      ],
    }),

    deleteFormTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FormTemplate', 'FormStatistics'],
    }),

    // Form Submissions
    submitForm: builder.mutation<FormSubmission, { templateId: string; data: CreateFormSubmissionRequest }>({
      query: ({ templateId, data }) => ({
        url: `/templates/${templateId}/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FormSubmission', 'FormStatistics'],
    }),

    getFormSubmissions: builder.query<SubmissionsListResponse, {
      page?: number;
      limit?: number;
      templateId?: string;
      status?: string;
    }>({
      query: ({ page = 1, limit = 10, templateId, status }) => ({
        url: '/submissions',
        params: { page, limit, templateId, status },
      }),
      providesTags: ['FormSubmission'],
    }),

    getFormSubmission: builder.query<FormSubmission, string>({
      query: (id) => `/submissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'FormSubmission', id }],
    }),

    updateFormSubmission: builder.mutation<FormSubmission, { id: string; data: UpdateFormSubmissionRequest }>({
      query: ({ id, data }) => ({
        url: `/submissions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FormSubmission', id },
        'FormSubmission',
        'FormStatistics',
      ],
    }),

    deleteFormSubmission: builder.mutation<void, string>({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FormSubmission', 'FormStatistics'],
    }),

    // Statistics
    getFormStatistics: builder.query<FormStatistics, void>({
      query: () => '/statistics',
      providesTags: ['FormStatistics'],
    }),
  }),
});

export const {
  // Form Templates
  useCreateFormTemplateMutation,
  useGetFormTemplatesQuery,
  useGetFormTemplateQuery,
  useGetPublicFormTemplateQuery,
  useUpdateFormTemplateMutation,
  useDeleteFormTemplateMutation,
  
  // Form Submissions
  useSubmitFormMutation,
  useGetFormSubmissionsQuery,
  useGetFormSubmissionQuery,
  useUpdateFormSubmissionMutation,
  useDeleteFormSubmissionMutation,
  
  // Statistics
  useGetFormStatisticsQuery,
} = formsApi;