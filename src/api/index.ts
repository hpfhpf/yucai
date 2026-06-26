import request from '@/utils/request';

// ===== Auth =====

export const apiLogin = (data: { phone: string; password: string }) =>
  request({ url: '/auth/login', method: 'POST', data } as any);

export const apiGetMe = () =>
  request({ url: '/auth/me', method: 'GET' } as any);

// ===== Users =====

export const apiGetUserMe = () =>
  request({ url: '/users/me', method: 'GET' } as any);

export const apiUpdateUserMe = (data: { nickname?: string }) =>
  request({ url: '/users/me', method: 'PUT', data } as any);

// ===== Jobs =====

export const apiGetJobs = (params?: {
  page?: number; limit?: number; city?: string;
  keyword?: string; nature?: string; companyId?: string;
}) => request({ url: '/jobs', method: 'GET', data: params } as any);

export const apiGetJobDetail = (id: string) =>
  request({ url: `/jobs/${id}`, method: 'GET' } as any);

export const apiDeliverJob = (id: string, data: { creditAuthorized: boolean }) =>
  request({ url: `/jobs/${id}/deliver`, method: 'POST', data } as any);

export const apiFavoriteJob = (id: string) =>
  request({ url: `/jobs/${id}/favorite`, method: 'POST' } as any);

export const apiUnfavoriteJob = (id: string) =>
  request({ url: `/jobs/${id}/favorite`, method: 'DELETE' } as any);

export const apiGetMyDeliveries = (params?: { page?: number; limit?: number }) =>
  request({ url: '/jobs/my-deliveries', method: 'GET', data: params } as any);

export const apiGetMyFavorites = (params?: { page?: number; limit?: number }) =>
  request({ url: '/jobs/my-favorites', method: 'GET', data: params } as any);

export const apiGetMyInvites = (params?: { page?: number; limit?: number }) =>
  request({ url: '/messages/invites', method: 'GET', data: params } as any);

export const apiMarkInviteRead = (id: string) =>
  request({ url: `/messages/${id}/read`, method: 'PATCH' } as any);

export const apiGetMyPostedJobs = (params?: { page?: number; limit?: number }) =>
  request({ url: '/jobs/my-posted', method: 'GET', data: params } as any);

export const apiCreateJob = (data: {
  title: string; nature?: string; province?: string; city?: string;
  district?: string; address?: string; salaryRange?: string;
  minDegree?: string; minExpYears?: number;
  description: string; perks?: string[];
}) => request({ url: '/jobs', method: 'POST', data } as any);

export const apiUpdateJob = (id: string, data: any) =>
  request({ url: `/jobs/${id}`, method: 'PUT', data } as any);

export const apiCloseJob = (id: string) =>
  request({ url: `/jobs/${id}`, method: 'DELETE' } as any);

// ===== Resume =====

export const apiGetResumeProfile = () =>
  request({ url: '/resume/profile', method: 'GET' } as any);

export const apiUpdateResumeProfile = (data: {
  realName?: string; gender?: string; birthDate?: string; city?: string; roleTitle?: string;
}) => request({ url: '/resume/profile', method: 'PUT', data } as any);

export const apiGetSelfDesc = () =>
  request({ url: '/resume/self-desc', method: 'GET' } as any);

export const apiUpdateSelfDesc = (data: { selfDesc?: string }) =>
  request({ url: '/resume/self-desc', method: 'PUT', data } as any);

export const apiGetEducations = () =>
  request({ url: '/resume/education', method: 'GET' } as any);

export const apiCreateEducation = (data: {
  school: string; major?: string; degree?: string; startDate?: string; endDate?: string;
}) => request({ url: '/resume/education', method: 'POST', data } as any);

export const apiUpdateEducation = (id: string, data: any) =>
  request({ url: `/resume/education/${id}`, method: 'PUT', data } as any);

export const apiDeleteEducation = (id: string) =>
  request({ url: `/resume/education/${id}`, method: 'DELETE' } as any);

export const apiGetWorkExps = () =>
  request({ url: '/resume/work-exp', method: 'GET' } as any);

export const apiCreateWorkExp = (data: {
  company: string; title: string; city?: string;
  skillTags?: string[]; content?: string; startDate?: string; endDate?: string;
}) => request({ url: '/resume/work-exp', method: 'POST', data } as any);

export const apiUpdateWorkExp = (id: string, data: any) =>
  request({ url: `/resume/work-exp/${id}`, method: 'PUT', data } as any);

export const apiDeleteWorkExp = (id: string) =>
  request({ url: `/resume/work-exp/${id}`, method: 'DELETE' } as any);

export const apiGetProjectExps = () =>
  request({ url: '/resume/project-exp', method: 'GET' } as any);

export const apiCreateProjectExp = (data: {
  name: string; role?: string; techTags?: string[]; content?: string;
  startDate?: string; endDate?: string;
}) => request({ url: '/resume/project-exp', method: 'POST', data } as any);

export const apiUpdateProjectExp = (id: string, data: any) =>
  request({ url: `/resume/project-exp/${id}`, method: 'PUT', data } as any);

export const apiDeleteProjectExp = (id: string) =>
  request({ url: `/resume/project-exp/${id}`, method: 'DELETE' } as any);

// ===== Companies =====

export const apiSearchCompanies = (params?: { keyword?: string; limit?: number }) =>
  request({ url: '/companies', method: 'GET', data: params } as any);

export const apiCreateCompany = (data: {
  name: string; industry?: string; scale?: string; city?: string; province?: string;
}) => request({ url: '/companies', method: 'POST', data } as any);

// ===== Recruiter =====

export const apiGetRecruiterProfile = () =>
  request({ url: '/recruiter/profile', method: 'GET' } as any);

export const apiRegisterRecruiter = (data: {
  realName: string; companyId?: string; department?: string; contactPhone?: string;
}) => request({ url: '/recruiter/profile', method: 'POST', data } as any);

export const apiUpdateRecruiterProfile = (data: {
  realName?: string; department?: string; contactPhone?: string;
}) => request({ url: '/recruiter/profile', method: 'PUT', data } as any);

export const apiGetSeekers = (params?: { page?: number; limit?: number; city?: string; keyword?: string }) =>
  request({ url: '/recruiter/seekers', method: 'GET', data: params } as any);

export const apiGetSeekerResume = (userId: string) =>
  request({ url: `/recruiter/seekers/${userId}`, method: 'GET' } as any);

export const apiGetRecruiterDeliveries = (params?: { page?: number; limit?: number; jobId?: string; status?: string }) =>
  request({ url: '/recruiter/deliveries', method: 'GET', data: params } as any);

export const apiUpdateDeliveryStatus = (id: string, data: { status: string }) =>
  request({ url: `/recruiter/deliveries/${id}/status`, method: 'PUT', data } as any);

export const apiSendInvite = (data: { seekerUserId: string; jobId: string; content: string }) =>
  request({ url: '/recruiter/invite', method: 'POST', data } as any);

export const apiGetInvites = (params?: { page?: number; limit?: number }) =>
  request({ url: '/recruiter/invites', method: 'GET', data: params } as any);

// ===== Work Certification =====

export const apiGetCertifications = () =>
  request({ url: '/resume/certifications', method: 'GET' } as any);

export const apiGetCertificationsGiven = () =>
  request({ url: '/resume/certifications/given', method: 'GET' } as any);

export const apiRequestWorkCert = (workExpId: string) =>
  request({ url: `/resume/work-exp/${workExpId}/request-cert`, method: 'POST' } as any);

export const apiGetCertInfo = (shareToken: string) =>
  request({ url: `/resume/certify/${shareToken}`, method: 'GET' } as any);

export const apiConfirmWorkCert = (shareToken: string, data: {
  relationship?: string; recommendation?: string; knowFrom?: string; knowTo?: string; anonymous?: boolean;
}) => request({ url: `/resume/certify/${shareToken}`, method: 'POST', data } as any);

export const apiCancelWorkCert = (workExpId: string) =>
  request({ url: `/resume/work-exp/${workExpId}/cert`, method: 'DELETE' } as any);

// ===== 远程视频（保留原有）=====
export const postApiSelectByConditions = (data: any) =>
  request({ url: '/api3/video/participants/selectByConditions', method: 'POST', data } as any);
