"use client";
import React, { useState } from "react";
import { FileText, Plus, Eye, Download, Edit, Trash2, Calendar, User, ExternalLink } from "lucide-react";
import { 
  useGetFormTemplatesQuery,
  useGetFormSubmissionsQuery,
  useGetFormStatisticsQuery,
  useDeleteFormTemplateMutation,
  useDeleteFormSubmissionMutation,
  FormTemplate,
  FormSubmission,
} from "@/store/api/forms";

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'templates'>('submissions');
  const [currentPage, setCurrentPage] = useState(1);
  const [templateFilter, setTemplateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // API Queries
  const { 
    data: templatesData, 
    isLoading: templatesLoading,
    refetch: refetchTemplates 
  } = useGetFormTemplatesQuery({ 
    page: currentPage, 
    limit: 10,
    type: templateFilter || undefined,
    isActive: true 
  });

  const { 
    data: submissionsData, 
    isLoading: submissionsLoading,
    refetch: refetchSubmissions 
  } = useGetFormSubmissionsQuery({ 
    page: currentPage, 
    limit: 10,
    status: statusFilter || undefined 
  });

  const { data: statistics } = useGetFormStatisticsQuery();

  // Mutations
  const [deleteTemplate] = useDeleteFormTemplateMutation();
  const [deleteSubmission] = useDeleteFormSubmissionMutation();

  const templates = templatesData?.templates || [];
  const submissions = submissionsData?.submissions || [];
  const isLoading = templatesLoading || submissionsLoading;

  // Handler functions
  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(templateId).unwrap();
        refetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template');
      }
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteSubmission(submissionId).unwrap();
        refetchSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'consent': return 'bg-red-100 text-red-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      case 'intake': return 'bg-blue-100 text-blue-800';
      case 'follow_up': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Customer Forms</h1>
              </div>
              <p className="text-gray-600">Manage consultation forms, consent forms, and customer submissions</p>
              {statistics && (
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                  <span>📝 {statistics.totalTemplates} Templates</span>
                  <span>📋 {statistics.totalSubmissions} Submissions</span>
                  <span>⏳ {statistics.pendingSubmissions} Pending</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href="/provider/forms/create"
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </a>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {activeTab === 'templates' && (
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="CONSULTATION">Consultation</option>
              <option value="CONSENT">Consent</option>
              <option value="INTAKE">Intake</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="FEEDBACK">Feedback</option>
              <option value="CUSTOM">Custom</option>
            </select>
          )}
          
          {activeTab === 'submissions' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Form Submissions ({submissionsData?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Form Templates ({templatesData?.total || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'submissions' ? (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No form submissions yet</h3>
                <p className="text-gray-500">Customer form submissions will appear here.</p>
              </div>
            ) : (
              submissions.map((submission: FormSubmission) => (
                <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">
                          {submission.formTemplate?.title || 'Form Submission'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                        {submission.formTemplate?.type && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getTypeColor(submission.formTemplate.type)}`}>
                            {submission.formTemplate.type.toLowerCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{submission.customerName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(submission.submittedAt)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {submission.responses?.length || 0} fields completed
                        </div>
                      </div>

                      {submission.responses && submission.responses.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Responses Preview:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {submission.responses.slice(0, 4).map((response, index) => (
                              <div key={index} className="text-gray-600">
                                <span className="font-medium">{response.fieldName}:</span>{' '}
                                {Array.isArray(response.value) ? response.value.join(', ') : response.value}
                              </div>
                            ))}
                            {submission.responses.length > 4 && (
                              <div className="text-gray-500 italic">
                                +{submission.responses.length - 4} more fields...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {submission.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Notes:</strong> {submission.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <a
                        href={`/provider/forms/submissions/${submission.id}`}
                        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </a>
                      <button className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No form templates</h3>
                <p className="text-gray-500 mb-4">Create your first form template to collect customer information.</p>
                <a
                  href="/provider/forms/create"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </a>
              </div>
            ) : (
              templates.map((template: FormTemplate) => (
                <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">{template.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                          {template.type.toLowerCase()}
                        </span>
                        {template.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                            Active
                          </span>
                        )}
                      </div>
                      
                      {template.description && (
                        <p className="text-gray-600 mb-4">{template.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {formatDate(template.createdAt)}
                        <span className="mx-2">•</span>
                        {template.fields?.length || 0} fields
                        {template.submissionsCount !== undefined && (
                          <>
                            <span className="mx-2">•</span>
                            {template.submissionsCount} submissions
                          </>
                        )}
                      </div>

                      {template.fields && template.fields.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Form Fields:</h4>
                          <div className="flex flex-wrap gap-2">
                            {template.fields.map((field, index) => (
                              <span
                                key={field.id || index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {field.label} ({field.type})
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Public Form Link */}
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">Public Form Link</p>
                            <p className="text-xs text-green-600">Share this link with customers to fill the form</p>
                          </div>
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/forms/${template.id}`;
                              navigator.clipboard.writeText(link);
                              alert('Link copied to clipboard!');
                            }}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <a
                        href={`/forms/${template.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </a>
                      <a
                        href={`/provider/forms/edit/${template.id}`}
                        className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </a>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {(templatesData?.total || submissionsData?.total) && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {Math.ceil((activeTab === 'templates' ? templatesData?.total || 0 : submissionsData?.total || 0) / 10)}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil((activeTab === 'templates' ? templatesData?.total || 0 : submissionsData?.total || 0) / 10)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}