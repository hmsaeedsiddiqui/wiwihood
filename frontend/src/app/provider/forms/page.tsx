"use client";
import React, { useState, useEffect } from "react";
import { FileText, Plus, Eye, Download, Edit, Trash2, Calendar, User } from "lucide-react";
import QRTIntegration from "@/utils/qrtIntegration";

interface CustomerForm {
  id: string;
  formName: string;
  customerName: string;
  customerEmail: string;
  submitDate: string;
  status: 'completed' | 'pending' | 'reviewed';
  formType: 'consultation' | 'consent' | 'feedback' | 'medical' | 'custom';
  responses: { [key: string]: any };
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  type: 'consultation' | 'consent' | 'feedback' | 'medical' | 'custom';
  fields: FormField[];
  isActive: boolean;
  createdDate: string;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone';
  label: string;
  required: boolean;
  options?: string[];
}

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'templates'>('submissions');
  const [forms, setForms] = useState<CustomerForm[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  useEffect(() => {
    fetchForms();
    fetchTemplates();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      console.log('📋 QRT: Loading customer forms...');
      
      // Mock data - replace with real API call
      const formsData = [
        {
          id: 'FORM-001',
          formName: 'Hair Consultation Form',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.johnson@email.com',
          submitDate: '2024-10-07T14:30:00Z',
          status: 'completed' as const,
          formType: 'consultation' as const,
          responses: {
            'hair_type': 'Curly',
            'previous_treatments': 'Hair coloring 6 months ago',
            'allergies': 'None',
            'preferred_style': 'Long layers with highlights',
            'budget': '150-200 AED'
          }
        },
        {
          id: 'FORM-002',
          formName: 'Treatment Consent Form',
          customerName: 'Emma Wilson',
          customerEmail: 'emma.wilson@email.com',
          submitDate: '2024-10-06T10:15:00Z',
          status: 'reviewed' as const,
          formType: 'consent' as const,
          responses: {
            'treatment_name': 'Chemical Peel',
            'understands_risks': true,
            'medical_conditions': 'None',
            'consent_given': true,
            'emergency_contact': '+971 50 999 7777'
          }
        },
        {
          id: 'FORM-003',
          formName: 'Service Feedback',
          customerName: 'Mike Chen',
          customerEmail: 'mike.chen@email.com',
          submitDate: '2024-10-05T16:45:00Z',
          status: 'pending' as const,
          formType: 'feedback' as const,
          responses: {
            'service_rating': 5,
            'staff_rating': 5,
            'facility_rating': 4,
            'comments': 'Excellent service, very professional staff',
            'recommend': true
          }
        }
      ];
      
      setForms(formsData);
      console.log('✅ QRT: Forms loaded successfully');
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      console.log('📝 QRT: Loading form templates...');
      
      // Mock data - replace with real API call
      const templatesData = [
        {
          id: 'TEMP-001',
          name: 'Hair Consultation Form',
          description: 'Comprehensive consultation form for hair services',
          type: 'consultation' as const,
          isActive: true,
          createdDate: '2024-09-15T10:00:00Z',
          fields: [
            { id: 'f1', name: 'hair_type', type: 'select' as const, label: 'Hair Type', required: true, options: ['Straight', 'Wavy', 'Curly', 'Coily'] },
            { id: 'f2', name: 'previous_treatments', type: 'textarea' as const, label: 'Previous Treatments', required: false },
            { id: 'f3', name: 'allergies', type: 'textarea' as const, label: 'Known Allergies', required: true },
            { id: 'f4', name: 'preferred_style', type: 'textarea' as const, label: 'Preferred Style Description', required: true },
            { id: 'f5', name: 'budget', type: 'select' as const, label: 'Budget Range', required: true, options: ['Under 100 AED', '100-200 AED', '200-300 AED', 'Above 300 AED'] }
          ]
        },
        {
          id: 'TEMP-002',
          name: 'Treatment Consent Form',
          description: 'Legal consent form for advanced treatments',
          type: 'consent' as const,
          isActive: true,
          createdDate: '2024-09-20T14:30:00Z',
          fields: [
            { id: 'f1', name: 'treatment_name', type: 'text' as const, label: 'Treatment Name', required: true },
            { id: 'f2', name: 'understands_risks', type: 'checkbox' as const, label: 'I understand the risks involved', required: true },
            { id: 'f3', name: 'medical_conditions', type: 'textarea' as const, label: 'Medical Conditions', required: false },
            { id: 'f4', name: 'consent_given', type: 'checkbox' as const, label: 'I give my consent for this treatment', required: true },
            { id: 'f5', name: 'emergency_contact', type: 'phone' as const, label: 'Emergency Contact', required: true }
          ]
        }
      ];
      
      setTemplates(templatesData);
      console.log('✅ QRT: Templates loaded successfully');
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'consent': return 'bg-red-100 text-red-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
            </div>
            <button
              onClick={() => setShowCreateTemplate(true)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </button>
          </div>
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
                Form Submissions ({forms.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Form Templates ({templates.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'submissions' ? (
          <div className="space-y-4">
            {forms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No form submissions yet</h3>
                <p className="text-gray-500">Customer form submissions will appear here.</p>
              </div>
            ) : (
              forms.map((form) => (
                <div key={form.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">{form.formName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getTypeColor(form.formType)}`}>
                          {form.formType}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{form.customerName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{new Date(form.submitDate).toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {Object.keys(form.responses).length} fields completed
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Responses Preview:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(form.responses).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-gray-600">
                              <span className="font-medium">{key.replace('_', ' ')}:</span>{' '}
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                            </div>
                          ))}
                          {Object.keys(form.responses).length > 4 && (
                            <div className="text-gray-500 italic">
                              +{Object.keys(form.responses).length - 4} more fields...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
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
                <p className="text-gray-500">Create your first form template to collect customer information.</p>
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">{template.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                          {template.type}
                        </span>
                        {template.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {new Date(template.createdDate).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        {template.fields.length} fields
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Form Fields:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.fields.map((field) => (
                            <span
                              key={field.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              {field.label} ({field.type})
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </button>
                      <button className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
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
      </div>
    </div>
  );
}