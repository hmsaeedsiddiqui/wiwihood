'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Check,
  X,
  Star,
  AlertCircle,
  Clock,
  DollarSign,
  Tag,
  MapPin,
  Building2,
  Calendar,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Crown,
  Zap,
  Trophy,
  Gift,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { CloudinaryImage } from '@/components/cloudinary/CloudinaryImage';
import { toast } from 'react-hot-toast';
import {
  useGetAllAdminServicesQuery,
  useApproveAdminServiceMutation,
  useBulkAdminServiceActionMutation,
  useAssignAdminBadgeMutation,
  useToggleAdminServiceStatusMutation,
  useGetAdminServiceStatsQuery,
  useGetAdminAvailableBadgesQuery,
  useExportAdminServicesDataMutation,
  useDeleteAdminServiceMutation,
  useSetAdminServicePendingMutation,
  AdminServiceFilters
} from '@/store/api/servicesApi';

// Fallback icon map for known badges (optional visuals)
const badgeIconMap: Record<string, any> = {
  'New on vividhood': Sparkles,
  'Popular': Star,
  'Hot Deal': Zap,
  'Best Seller': Trophy,
  'Limited Time': Clock,
  'Premium': Crown,
  'Top Rated': Award,
  'Special Offer': Gift,
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Gate this page to admin role only; redirect others to admin login
  useEffect(() => {
    try {
      const storedAdmin = typeof window !== 'undefined' ? (localStorage.getItem('admin') || '') : '';
      const userStr = typeof window !== 'undefined' ? (localStorage.getItem('user') || '') : '';
      const adminObj = storedAdmin ? JSON.parse(storedAdmin) : null;
      const user = userStr ? JSON.parse(userStr) : null;
      const isAdmin = (!!adminObj && (adminObj.role === 'admin' || adminObj.userType === 'admin')) || (!!user && (user.role === 'admin' || user.userType === 'admin'));
      setIsAuthorized(isAdmin);
      setAuthChecked(true);
      if (!isAdmin) {
        // Prevent provider/customer tokens from hammering admin APIs
        router.replace('/auth/admin/login');
      }
    } catch {
      setIsAuthorized(false);
      setAuthChecked(true);
      router.replace('/auth/admin/login');
    }
  }, [router]);
  // Add toggle status mutation
  const [toggleAdminServiceStatus] = useToggleAdminServiceStatusMutation();
  // API hooks for real data
  const [filters, setFilters] = useState<AdminServiceFilters>({
    page: 1,
    limit: 10,
    // status intentionally omitted for backend compatibility
  });
  
  const { 
    data: servicesData, 
    isLoading: servicesLoading, 
    error: servicesError,
    refetch: refetchServices
  } = useGetAllAdminServicesQuery(filters, {
    skip: !isAuthorized,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [approveAdminService] = useApproveAdminServiceMutation();
  const [bulkAdminServiceAction] = useBulkAdminServiceActionMutation();
  const [assignAdminBadge] = useAssignAdminBadgeMutation();
  const [exportAdminServicesData, { isLoading: exportLoading }] = useExportAdminServicesDataMutation();
  const [deleteAdminService] = useDeleteAdminServiceMutation();
  const [setAdminServicePending] = useSetAdminServicePendingMutation();

  // Dedicated stats endpoint for dynamic dashboard numbers
  const { data: statsData, isLoading: statsLoading, isFetching: statsFetching, isError: statsError, refetch: refetchStats } = useGetAdminServiceStatsQuery(undefined, { skip: !isAuthorized });
  // Available badges from API (dynamic)
  const { data: availableBadgesData } = useGetAdminAvailableBadgesQuery(undefined, { skip: !isAuthorized });
  const availableBadges = availableBadgesData?.badges || [];

  const services = servicesData?.services || [];
  const totalCount = servicesData?.total || 0;
  // Derive robust statistics with multiple fallbacks
  const stats = useMemo(() => {
    const api = statsData as any | undefined;
    const listStats = (servicesData as any)?.stats as any | undefined;
    const list = services;

    const toUpper = (v: any) => (v ?? '').toString().toUpperCase();
    const countsFromList = () => {
      let pending = 0, approved = 0, rejected = 0, active = 0, inactive = 0;
      for (const s of list) {
        const st = toUpper((s as any).approvalStatus);
        const isApproved = st === 'APPROVED';
        const isActive = !!(s as any).isActive;
        if (st === 'PENDING_APPROVAL') pending++;
        else if (st === 'APPROVED') approved++;
        else if (st === 'REJECTED') rejected++;
        if (isApproved && isActive) active++; // only approved can be active
      }
      // Fallback inactive based on available list information
      // If totalCount available use that, otherwise use list length
      const total = typeof servicesData?.total === 'number' ? servicesData!.total : list.length;
      // inactive here is an approximation from list view (not global) when api stats missing
      inactive = Math.max(0, total - active);
      return { pending, approved, rejected, active, inactive, total };
    };

    const listDerived = countsFromList();
    const total = (api?.total ?? listStats?.total ?? (typeof servicesData?.total === 'number' ? servicesData!.total : listDerived.total) ?? 0) as number;
    const pending = (api?.pending ?? listStats?.pending ?? listDerived.pending ?? 0) as number;
    const approved = (api?.approved ?? listStats?.approved ?? listDerived.approved ?? 0) as number;
    const rejected = (api?.rejected ?? listStats?.rejected ?? listDerived.rejected ?? 0) as number;
    const active = (api?.active ?? listStats?.active ?? listDerived.active ?? 0) as number;
    const inactive = (api?.inactive ?? listStats?.inactive ?? listDerived.inactive ?? Math.max(0, total - active)) as number;

    return { total, pending, approved, rejected, active, inactive };
  }, [statsData, servicesData, services]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  // Watchdog: if loading takes > 8s, show a helpful hint
  useEffect(() => {
    if (servicesLoading) {
      const t = setTimeout(() => setIsSlowLoading(true), 8000);
      return () => clearTimeout(t);
    } else {
      setIsSlowLoading(false);
    }
  }, [servicesLoading]);
  // Per-row loading states
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  // Optimistic approvals to instantly reflect UI
  const [locallyApprovedIds, setLocallyApprovedIds] = useState<Set<string>>(new Set());
  // Track status changes (pending/approve/reject)
  const [statusChangingIds, setStatusChangingIds] = useState<Set<string>>(new Set());
  // Local status overrides to reflect selection immediately
  const [statusOverrides, setStatusOverrides] = useState<Map<string, 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'>>(new Map());
  // Local active overrides to reflect activation state immediately (e.g., when moving to pending => deactivate)
  const [activeOverrides, setActiveOverrides] = useState<Map<string, boolean>>(new Map());

  // Update filters when search or status filter changes
  // Helper to map frontend status to correct enum casing for AdminServiceFilters
  const mapStatusToFilterEnum = (status: string): AdminServiceFilters['status'] => {
    switch (status) {
  case 'PENDING_APPROVAL': return 'PENDING_APPROVAL';
  case 'APPROVED': return 'APPROVED';
  case 'REJECTED': return 'REJECTED';
  case 'ACTIVE': return 'ACTIVE';
  case 'INACTIVE': return 'INACTIVE';
      default: return undefined;
    }
  };

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      status: statusFilter !== 'ALL' ? mapStatusToFilterEnum(statusFilter) : undefined,
      page: 1
    }));
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Update filters when page changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: currentPage
    }));
  }, [currentPage]);

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // stats computed via useMemo above

  const handleExport = async () => {
    try {
      const payloadFilters: any = { ...filters };
      // Backend export ignores pagination; we can send current filters
      const result = await exportAdminServicesData(payloadFilters).unwrap();
      // Convert to CSV minimally
      const headers = [
        'id','name','provider','category','price','duration','status','isActive','badge','qualityRating','submittedAt','approvedAt','adminComments'
      ];
      const rows = [headers.join(',')].concat(
        (result.data || []).map((r: any) => [
          r.id, r.name, r.provider, r.category, r.price, r.duration, r.status, r.isActive, r.badge, r.qualityRating, r.submittedAt, r.approvedAt, (r.adminComments || '').replace(/\n|\r|,/g, ' ')
        ].join(','))
      );
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `services-export-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Failed to export data: ${error?.data?.message || error?.message || 'Unknown error'}`);
    }
  };

  const handleApproveService = async (service: any, approved: boolean, badge?: string, rating?: number, comments?: string) => {
    try {
      // Disallow approving a rejected service
      const effectiveStatus = (statusOverrides.get(service.id) || service.approvalStatus || '').toString().toUpperCase();
      if (effectiveStatus === 'REJECTED' && approved) {
        toast.error('Rejected service cannot be approved.');
        return;
      }
      // Build payload carefully to satisfy backend validators
      const approvalData: any = { isApproved: approved };
      if (comments && comments.trim().length > 0) approvalData.adminComments = comments.trim();
      if (badge && badge.trim().length > 0) approvalData.adminAssignedBadge = badge;
      if (typeof rating === 'number' && rating >= 1) approvalData.adminQualityRating = rating;
      // Optimistic local update
      if (approved) {
        setLocallyApprovedIds(prev => new Set(prev).add(service.id));
      }
      await approveAdminService({ serviceId: service.id, approvalData }).unwrap();
      refetchServices();
      setShowApprovalModal(false);
      setSelectedService(null);
      toast.success(approved ? 'Service approved and activated' : 'Service rejected');
    } catch (error) {
      console.error('Failed to approve/reject service:', error);
      toast.error('Failed to update service status.');
      // Rollback optimistic update on failure
      setLocallyApprovedIds(prev => {
        const next = new Set(prev); next.delete(service.id); return next;
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        // Use dedicated delete endpoint for single deletion
        await deleteAdminService(serviceId).unwrap();
        refetchServices();
        toast.success('Service deleted');
      } catch (error) {
        console.error('Failed to delete service:', error);
        toast.error('Failed to delete service.');
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedServices.length === 0) return;

    const actionMap: { [key: string]: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete' } = {
      'approve': 'approve',
      'reject': 'reject', 
      'delete': 'delete',
      'activate': 'activate',
      'deactivate': 'deactivate'
    };

    const mappedAction = actionMap[action];
    if (!mappedAction) return;

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedServices.length} services?`
      : `Are you sure you want to ${action} ${selectedServices.length} services?`;

    if (confirm(confirmMessage)) {
      try {
        // Backend DTO does not accept an extra 'reason' property
        await bulkAdminServiceAction({
          serviceIds: selectedServices,
          action: mappedAction,
        }).unwrap();
        refetchServices();
        setSelectedServices([]);
        const verb = action === 'delete' ? 'deleted' : action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'activate' ? 'activated' : 'deactivated';
        toast.success(`Services ${verb}`);
      } catch (error: any) {
        // Enhanced error logging for debugging
        const errorDetails = {
          error,
          data: error?.data,
          message: error?.data?.message || error?.message,
          status: error?.status,
          request: {
            serviceIds: selectedServices,
            action,
            // reason omitted as backend rejects unknown properties
          }
        };
        console.error(`Failed to ${action} services:`, errorDetails);
        toast.error(`Failed to ${action} services.`);
      }
    }
  };

  const openApprovalModal = (service: any) => {
    setSelectedService(service);
    setShowApprovalModal(true);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    const normalized = (status || '').toString().toUpperCase();
    switch (normalized) {
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            <CheckCircle className="w-3 h-3" />
            {isActive ? 'Active' : 'Approved'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Handle status select changes per service
  const handleChangeServiceStatus = async (service: any, nextStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED') => {
    // Disallow changing a rejected service back to pending/approved per requirement
    const currentEffective = (statusOverrides.get(service.id) || (service.approvalStatus || '')).toString().toUpperCase();
    if (currentEffective === 'REJECTED' && nextStatus !== 'REJECTED') {
      toast.error('Rejected service cannot be moved to Pending or Approved.');
      return;
    }
    // Disallow changing an approved service back to pending/rejected per requirement
    if (currentEffective === 'APPROVED' && nextStatus !== 'APPROVED') {
      toast.error('Approved service cannot be moved to Pending or Rejected.');
      return;
    }
    if (statusChangingIds.has(service.id)) return;
    // Reflect selection immediately in UI
    setStatusOverrides(prev => {
      const m = new Map(prev);
      m.set(service.id, nextStatus);
      return m;
    });
  // For status selection: Pending/Rejected => inactive view; Approved => keep existing active state (do not auto-activate)
  const prevActive = activeOverrides.has(service.id) ? (activeOverrides.get(service.id) as boolean) : service.isActive;
  const nextActiveByStatus = nextStatus === 'APPROVED' ? prevActive : false;
  setActiveOverrides(prev => { const n = new Map(prev); n.set(service.id, nextActiveByStatus); return n; });
    setStatusChangingIds(prev => {
      const s = new Set(prev);
      s.add(service.id);
      return s;
    });
    try {
      if (nextStatus === 'PENDING_APPROVAL') {
        // Move back to pending
        await setAdminServicePending(service.id).unwrap();
        // Ensure local approved override is cleared
        setLocallyApprovedIds(prev => { const n = new Set(prev); n.delete(service.id); return n; });
        toast.success('Moved to pending');
      } else if (nextStatus === 'APPROVED') {
        // Approve (do not force activation; toggle controls active state)
        await approveAdminService({ serviceId: service.id, approvalData: { isApproved: true } }).unwrap();
        toast.success('Approved');
      } else if (nextStatus === 'REJECTED') {
        // Reject
        setLocallyApprovedIds(prev => { const n = new Set(prev); n.delete(service.id); return n; });
        await approveAdminService({ serviceId: service.id, approvalData: { isApproved: false } }).unwrap();
        toast.success('Rejected');
      }
      // Refresh data and stats after mutation
      const refreshed = await refetchServices();
      refetchStats();
      // Only clear overrides if backend reflects the requested status
      try {
        const expectedBackend = nextStatus === 'APPROVED' ? 'approved' : nextStatus === 'REJECTED' ? 'rejected' : 'pending_approval';
        const list = (refreshed as any)?.data?.services || servicesData?.services || [];
        const updated = list.find((s: any) => s.id === service.id);
        if (updated && updated.approvalStatus === expectedBackend) {
          setStatusOverrides(prev => { const m = new Map(prev); m.delete(service.id); return m; });
          setActiveOverrides(prev => { const m = new Map(prev); m.delete(service.id); return m; });
        } else {
          // Keep overrides so UI doesn't incorrectly revert; surface a soft warning
          toast.custom((t) => (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded shadow-sm">
              Awaiting server confirmation…
            </div>
          ), { duration: 2000 });
          // Try one gentle follow-up refetch after a short delay
          setTimeout(async () => {
            const retry = await refetchServices();
            const list2 = (retry as any)?.data?.services || servicesData?.services || [];
            const updated2 = list2.find((s: any) => s.id === service.id);
            if (updated2 && updated2.approvalStatus === expectedBackend) {
              setStatusOverrides(prev => { const m = new Map(prev); m.delete(service.id); return m; });
              setActiveOverrides(prev => { const m = new Map(prev); m.delete(service.id); return m; });
            }
          }, 600);
        }
      } catch {
        // On any parsing issue, do not clear overrides to avoid wrong UI
      }
    } catch (error: any) {
      // Rollback optimistic approval on error
      // no need to mutate locallyApprovedIds; we compute from effectiveStatus only
      // Revert override on error
      setStatusOverrides(prev => {
        const m = new Map(prev);
        m.delete(service.id);
        return m;
      });
      // Rollback active override
      setActiveOverrides(prev => { const n = new Map(prev); n.set(service.id, prevActive); return n; });
      const msg = error?.data?.message || error?.message || 'Failed to update status';
      toast.error(msg);
    } finally {
      setStatusChangingIds(prev => { const n = new Set(prev); n.delete(service.id); return n; });
    }
  };

  // Loading state
  // Show a quick guard while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking admin access…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authorized, a redirect has been initiated; show minimal UI
  if (authChecked && isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600">Redirecting to admin login…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Note: Do not early return on services loading/error; render stats always and handle table states inline

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
              <p className="text-gray-600">Review, approve, and manage all provider services</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleExport} disabled={exportLoading} className={`px-4 py-2 ${exportLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors flex items-center gap-2`}>
                <Filter className="w-4 h-4" />
                {exportLoading ? 'Exporting…' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{(statsLoading && !statsData) ? '—' : stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{(statsLoading && !statsData) ? '—' : stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{(statsLoading && !statsData) ? '—' : stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Services</p>
                <p className="text-2xl font-bold text-blue-600">{(statsLoading && !statsData) ? '—' : stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{(statsLoading && !statsData) ? '—' : stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services, providers, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING_APPROVAL">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              
              {selectedServices.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Approve ({selectedServices.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedServices.length === services.length && services.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices(services.map(s => s.id));
                        } else {
                          setSelectedServices([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Service</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Provider</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Badge</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Submitted</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Table states: loading/error/empty */}
                {servicesLoading && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p>Loading services…</p>
                        {isSlowLoading && (
                          <div className="mt-3 flex items-center gap-2">
                            <button onClick={() => refetchServices()} className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Try again</button>
                            <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Reset filters</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {!servicesLoading && servicesError && (
                  <tr>
                    <td colSpan={9} className="py-8">
                      <div className="flex items-center justify-between bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>Failed to load services.</span>
                        </div>
                        <button onClick={() => refetchServices()} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700">Try again</button>
                      </div>
                    </td>
                  </tr>
                )}
                {!servicesLoading && !servicesError && services.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">No services found.</td>
                  </tr>
                )}
                {!servicesLoading && !servicesError && services.map((service) => {
                  const approvalUpper = (service.approvalStatus || '').toString().toUpperCase();
                  const overridden = statusOverrides.get(service.id);
                  const effectiveStatus = overridden || approvalUpper;
                  // Determine approved strictly from current effective status (no mixing with old server flags)
                  const isApprovedNow = (effectiveStatus === 'APPROVED');
                  // If not approved, force inactive display
                  const baseActive = activeOverrides.has(service.id) ? (activeOverrides.get(service.id) as boolean) : service.isActive;
                  const effectiveActive = isApprovedNow ? baseActive : false;
                  return (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {service.featuredImage && (
                          <CloudinaryImage
                            src={service.featuredImage}
                            alt={service.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500 max-w-xs truncate">{service.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.provider.businessName}</p>
                        <p className="text-xs text-gray-500">{service.provider.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                        <Tag className="w-3 h-3" />
                        {service.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{service.basePrice}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(isApprovedNow ? 'APPROVED' : effectiveStatus, effectiveActive)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {service.adminAssignedBadge ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800">
                            <Star className="w-3 h-3" />
                            {service.adminAssignedBadge}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No badge</span>
                        )}
                        <select
                          value={service.adminAssignedBadge || ''}
                          onChange={async (e) => {
                            try {
                              const val = e.target.value;
                              if (!val) {
                                // Do nothing on empty option; backend doesn't support clearing in this flow
                                return;
                              }
                              await assignAdminBadge({
                                serviceId: service.id,
                                badgeData: { badge: val }
                              }).unwrap();
                              refetchServices();
                            } catch (error) {
                              alert('Failed to assign badge.');
                            }
                          }}
                          className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Assign badge</option>
                          {(availableBadgesData?.badges || []).map((badge) => (
                            <option key={badge.value} value={badge.value}>{badge.label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-500">
                        {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : ''}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        {/* Status select: Pending / Rejected / Approved */}
                        <select
                          value={statusOverrides.get(service.id) || approvalUpper || 'PENDING_APPROVAL'}
                          onChange={(e) => handleChangeServiceStatus(service, e.target.value as any)}
                          disabled={statusChangingIds.has(service.id)}
                          className={`px-2 py-1 border rounded-md text-xs ${statusChangingIds.has(service.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          title="Change approval status"
                        >
                          <option value="PENDING_APPROVAL" disabled={['REJECTED','APPROVED'].includes((statusOverrides.get(service.id) || approvalUpper))} title={['REJECTED','APPROVED'].includes((statusOverrides.get(service.id) || approvalUpper)) ? 'Disabled in current status' : undefined}>Pending</option>
                          <option value="REJECTED" disabled={['REJECTED','APPROVED'].includes((statusOverrides.get(service.id) || approvalUpper))} title={['REJECTED','APPROVED'].includes((statusOverrides.get(service.id) || approvalUpper)) ? 'Disabled in current status' : undefined}>Rejected</option>
                          <option value="APPROVED" disabled={(statusOverrides.get(service.id) || approvalUpper) === 'REJECTED'} title={(statusOverrides.get(service.id) || approvalUpper) === 'REJECTED' ? 'Disabled for rejected services' : undefined}>Approved</option>
                        </select>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Active/Deactive toggle - controls homepage visibility */}
                        <div className="flex items-center gap-2">
                          {!isApprovedNow && (
                            <span className="text-xs text-gray-400">Approve first</span>
                          )}
                          <button
                            role="switch"
                            aria-checked={effectiveActive}
                            disabled={!isApprovedNow || togglingIds.has(service.id)}
                            onClick={async () => {
                              if (!isApprovedNow) return;
                              if (togglingIds.has(service.id)) return;
                              const prevActive = effectiveActive;
                              const nextActive = !prevActive;
                              // Optimistic active toggle
                              setActiveOverrides(prev => { const n = new Map(prev); n.set(service.id, nextActive); return n; });
                              setTogglingIds(prev => { const s = new Set(prev); s.add(service.id); return s; });
                              try {
                                const res = await toggleAdminServiceStatus(service.id).unwrap();
                                await refetchServices();
                                refetchStats();
                                toast.success(res?.service?.isActive ? 'Service activated' : 'Service deactivated');
                              } catch (error: any) {
                                const msg = error?.data?.message || 'Failed to toggle service status.';
                                toast.error(msg);
                                // Rollback optimistic toggle
                                setActiveOverrides(prev => { const n = new Map(prev); n.set(service.id, prevActive); return n; });
                              } finally {
                                setTogglingIds(prev => { const n = new Set(prev); n.delete(service.id); return n; });
                              }
                            }}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors border ${
                              !isApprovedNow
                                ? 'bg-gray-200 border-gray-300 cursor-not-allowed'
                                : togglingIds.has(service.id)
                                  ? 'bg-gray-400 border-gray-500 cursor-wait'
                                  : effectiveActive
                                    ? 'bg-green-500 border-green-600'
                                    : 'bg-gray-300 border-gray-400'
                            }`}
                            title={effectiveActive ? 'Deactivate Service' : 'Activate Service'}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                                effectiveActive ? 'translate-x-9' : 'translate-x-1'
                              }`}
                            />
                            <span className="absolute left-2 text-[10px] font-semibold text-white select-none">
                              {effectiveActive ? '' : (togglingIds.has(service.id) ? '…' : 'OFF')}
                            </span>
                            <span className="absolute right-2 text-[10px] font-semibold text-white select-none">
                              {effectiveActive ? (togglingIds.has(service.id) ? '…' : 'ON') : ''}
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  {(() => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = Math.min(startIndex + services.length, totalCount);
                    return `Showing ${startIndex + 1} to ${endIndex} of ${totalCount} services`;
                  })()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Service Approval Modal */}
        {showApprovalModal && selectedService && (
          <ServiceApprovalModal
            service={selectedService}
            availableBadges={availableBadges}
            onApprove={handleApproveService}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedService(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Service Approval Modal Component
function ServiceApprovalModal({ 
  service, 
  availableBadges, 
  onApprove, 
  onClose 
}: {
  service: any;
  availableBadges: any[];
  onApprove: (service: any, approved: boolean, badge?: string, rating?: number, comments?: string) => void;
  onClose: () => void;
}) {
  const [selectedBadge, setSelectedBadge] = useState(service.adminAssignedBadge || '');
  const [qualityRating, setQualityRating] = useState(service.adminQualityRating || 0);
  const [adminComments, setAdminComments] = useState(service.adminComments || '');

  const handleApprove = () => {
    onApprove(service, true, selectedBadge, qualityRating, adminComments);
  };

  const handleReject = () => {
    onApprove(service, false, '', 0, adminComments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Review Service</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <p className="text-lg font-medium text-gray-900">{service.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <p className="text-gray-900">{service.provider.businessName}</p>
                  <p className="text-sm text-gray-500">{service.provider.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{service.category.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <p className="text-gray-900">${service.basePrice}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{service.durationMinutes} min</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 text-sm">{service.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Images</h3>
              {service.images && service.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {service.images.slice(0, 4).map((image: string, index: number) => (
                    <CloudinaryImage
                      key={index}
                      src={image}
                      alt={`${service.name} image ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-lg object-cover w-full h-32"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  No images uploaded
                </p>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Review</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Badge Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Badge</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No badge</option>
                    {availableBadges.map((badge) => (
                      <option key={badge.value} value={badge.value}>
                        {badge.label}
                      </option>
                    ))}
                  </select>
                  {selectedBadge && (
                    <div className="mt-2">
                      {(() => {
                        const IconComponent = badgeIconMap[selectedBadge] || null;
                        return (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800`}>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {selectedBadge}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Quality Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setQualityRating(rating)}
                        className={`p-1 rounded transition-colors ${
                          rating <= qualityRating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {qualityRating > 0 ? `${qualityRating}/5` : 'Not rated'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {/* Admin Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Comments</label>
                  <textarea
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    rows={6}
                    placeholder="Add comments about the service quality, presentation, or any feedback for the provider..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={(service?.approvalStatus || '').toString().toUpperCase() === 'APPROVED'}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${ (service?.approvalStatus || '').toString().toUpperCase() === 'APPROVED' ? 'bg-red-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              title={(service?.approvalStatus || '').toString().toUpperCase() === 'APPROVED' ? 'Disabled for approved services' : undefined}
            >
              <X className="w-4 h-4" />
              Reject Service
            </button>
            <button
              onClick={handleApprove}
              disabled={(service?.approvalStatus || '').toString().toUpperCase() === 'REJECTED'}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${ (service?.approvalStatus || '').toString().toUpperCase() === 'REJECTED' ? 'bg-green-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              title={(service?.approvalStatus || '').toString().toUpperCase() === 'REJECTED' ? 'Disabled for rejected services' : undefined}
            >
              <Check className="w-4 h-4" />
              Approve & Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}