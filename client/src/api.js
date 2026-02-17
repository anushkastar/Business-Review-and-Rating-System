const API = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function request(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const auth = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

export const businesses = {
  list: (params = {}) => {
    const sp = new URLSearchParams(params).toString();
    return request('/businesses' + (sp ? '?' + sp : ''));
  },
  get: (id) => request('/businesses/' + id),
  create: (formData) => request('/businesses', { method: 'POST', body: formData }),
  myList: () => request('/businesses/my/list'),
};

export const reviews = {
  byBusiness: (businessId) => request('/reviews/business/' + businessId),
  submit: (formData) => request('/reviews', { method: 'POST', body: formData }),
  my: () => request('/reviews/my'),
};

export const admin = {
  dashboard: () => request('/admin/dashboard'),
  businesses: () => request('/admin/businesses'),
  approveBusiness: (id) => request('/admin/businesses/' + id + '/approve', { method: 'PATCH' }),
  rejectBusiness: (id) => request('/admin/businesses/' + id + '/reject', { method: 'PATCH' }),
  pendingReviews: () => request('/admin/reviews/pending'),
  approveReview: (id) => request('/admin/reviews/' + id + '/approve', { method: 'PATCH' }),
  rejectReview: (id) => request('/admin/reviews/' + id + '/reject', { method: 'PATCH' }),
  businessReviews: (id) => request('/admin/businesses/' + id + '/reviews'),
};
