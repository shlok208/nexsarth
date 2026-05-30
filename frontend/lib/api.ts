import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in all requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only logout if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  login: async (credentials: any) => {
    // OAuth2PasswordRequestForm expects x-www-form-urlencoded or multipart/form-data
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);
    
    const { data } = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },
  register: async (user: any) => {
    const { data } = await api.post('/auth/register', user);
    return data;
  },
  googleLogin: async (token: string) => {
    const { data } = await api.post(`/auth/google?token=${token}`);
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  getSetupStatus: async () => {
    const { data } = await api.get('/auth/setup-status');
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const LeadService = {
  getLeads: async (params?: any) => {
    // Filter out empty strings and nulls to avoid 422 errors on the backend
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) : undefined;
    const { data } = await api.get('/leads', { params: cleanParams });
    return data;
  },
  getLead: async (id: number) => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },
  getLeadConversations: async (id: number) => {
    const { data } = await api.get(`/leads/${id}/conversations`);
    return data;
  },
  getLeadStatusHistory: async (id: number) => {
    const { data } = await api.get(`/leads/${id}/status-history`);
    return data;
  },
  createLead: async (lead: any) => {
    const { data } = await api.post('/leads', lead);
    return data;
  },
  createLeadsBulk: async (leads: any[]) => {
    const { data } = await api.post('/leads/bulk', leads);
    return data;
  },
  deleteLead: async (id: number) => {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },
  updateLeadStatus: async (id: number, status: string) => {
    const { data } = await api.put(`/leads/${id}/status?status=${status}`);
    return data;
  },
};

export const StatsService = {
  getOverview: async () => {
    const { data } = await api.get('/stats/overview');
    return data;
  }
};

export const GmailService = {
  getStatus: async () => {
    const { data } = await api.get('/gmail/status');
    return data;
  },
  connect: async (credentials: any) => {
    const { data } = await api.post('/gmail/connect', credentials);
    return data;
  },
  disconnect: async () => {
    const { data } = await api.post('/gmail/disconnect');
    return data;
  }
};

export const SettingsService = {
  getProfile: async () => {
    const { data } = await api.get('/settings/profile');
    return data;
  },
  updateProfile: async (profile: any) => {
    const { data } = await api.post('/settings/profile', profile);
    return data;
  }
};

export default api;
