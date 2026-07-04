import request from '@/utils/request';

// ===== 管理端 API（运营 ADMIN / 超管 SUPER_ADMIN）=====

// 数据看板
export const apiAdminDashboard = () =>
  request({ url: '/admin/dashboard', method: 'GET' } as any);

// 用户管理
export const apiAdminListUsers = (params?: {
  page?: number; limit?: number; role?: string; keyword?: string;
}) => request({ url: '/admin/users', method: 'GET', data: params } as any);

export const apiAdminSetUserStatus = (id: string, status: number) =>
  request({ url: `/admin/users/${id}/status`, method: 'PUT', data: { status } } as any);

// 企业审核
export const apiAdminListCompanies = (params?: {
  page?: number; limit?: number; verified?: string; keyword?: string;
}) => request({ url: '/admin/companies', method: 'GET', data: params } as any);

export const apiAdminVerifyCompany = (id: string, data: { isVerified: boolean; creditScore?: number }) =>
  request({ url: `/admin/companies/${id}/verify`, method: 'PUT', data } as any);

// 职位管理
export const apiAdminListJobs = (params?: {
  page?: number; limit?: number; status?: string; keyword?: string;
}) => request({ url: '/admin/jobs', method: 'GET', data: params } as any);

export const apiAdminSetJobStatus = (id: string, status: string) =>
  request({ url: `/admin/jobs/${id}/status`, method: 'PUT', data: { status } } as any);

// 实名认证审核
export const apiAdminListIdVerifications = (params?: {
  page?: number; limit?: number; status?: string;
}) => request({ url: '/admin/id-verifications', method: 'GET', data: params } as any);

export const apiAdminReviewIdVerification = (id: string, data: { status: string; rejectReason?: string }) =>
  request({ url: `/admin/id-verifications/${id}/review`, method: 'PUT', data } as any);

// ===== 超管专属 =====
export const apiAdminSystemOverview = () =>
  request({ url: '/admin/system/overview', method: 'GET' } as any);

export const apiAdminListAdmins = () =>
  request({ url: '/admin/admins', method: 'GET' } as any);

export const apiAdminSetUserRole = (id: string, role: string) =>
  request({ url: `/admin/users/${id}/role`, method: 'PUT', data: { role } } as any);
