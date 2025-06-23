import axios from 'axios';
import { 
  ApiResponse, 
  PaginationParams, 
  FilterParams,
  User,
  UserRole,
  KPIData,
  PotentialProject,
  SignedProject,
  EngineeringProject,
  Client,
  RentalContract,
  PaymentOrder,
  Unit,
  Supplier,
  ProjectExpense,
  CommissionSettlement,
  Invoice,
  TodoItem,
  ClientService
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    // 统一错误处理
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================认证相关API===================
export const authApi = {
  // 用户登录
  login: (username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post('/auth/login', { username, password });
  },

  // 用户登出
  logout: (): Promise<ApiResponse> => {
    return api.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me');
  },

  // 更新用户资料
  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put('/auth/profile', data);
  },

  // 修改密码
  changePassword: (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    return api.put('/auth/password', { oldPassword, newPassword });
  }
};

// ===================仪表板相关API===================
export const dashboardApi = {
  // 获取KPI数据
  getKPIData: (role?: UserRole): Promise<ApiResponse<KPIData>> => {
    return api.get(`/dashboard/kpi${role ? `?role=${role}` : ''}`);
  },

  // 获取待办事项
  getTodoItems: (assignedTo?: string): Promise<ApiResponse<TodoItem[]>> => {
    return api.get(`/dashboard/todos${assignedTo ? `?assignedTo=${assignedTo}` : ''}`);
  },

  // 更新待办事项状态
  updateTodoStatus: (id: string, status: string): Promise<ApiResponse> => {
    return api.put(`/dashboard/todos/${id}/status`, { status });
  }
};

// ===================资产生命周期API===================
export const assetApi = {
  // 潜在项目相关
  potentialProjects: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PotentialProject[]>> => {
      return api.get('/assets/potential-projects', { params });
    },
    
    get: (id: string): Promise<ApiResponse<PotentialProject>> => {
      return api.get(`/assets/potential-projects/${id}`);
    },
    
    create: (data: Omit<PotentialProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PotentialProject>> => {
      return api.post('/assets/potential-projects', data);
    },
    
    update: (id: string, data: Partial<PotentialProject>): Promise<ApiResponse<PotentialProject>> => {
      return api.put(`/assets/potential-projects/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/assets/potential-projects/${id}`);
    }
  },

  // 签约项目相关
  signedProjects: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<SignedProject[]>> => {
      return api.get('/assets/signed-projects', { params });
    },
    
    get: (id: string): Promise<ApiResponse<SignedProject>> => {
      return api.get(`/assets/signed-projects/${id}`);
    },
    
    create: (data: Omit<SignedProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SignedProject>> => {
      return api.post('/assets/signed-projects', data);
    },
    
    update: (id: string, data: Partial<SignedProject>): Promise<ApiResponse<SignedProject>> => {
      return api.put(`/assets/signed-projects/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/assets/signed-projects/${id}`);
    }
  },

  // 工程项目相关
  engineeringProjects: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<EngineeringProject[]>> => {
      return api.get('/assets/engineering-projects', { params });
    },
    
    get: (id: string): Promise<ApiResponse<EngineeringProject>> => {
      return api.get(`/assets/engineering-projects/${id}`);
    },
    
    create: (data: Omit<EngineeringProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EngineeringProject>> => {
      return api.post('/assets/engineering-projects', data);
    },
    
    update: (id: string, data: Partial<EngineeringProject>): Promise<ApiResponse<EngineeringProject>> => {
      return api.put(`/assets/engineering-projects/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/assets/engineering-projects/${id}`);
    },

    // 更新工程进度
    updateProgress: (id: string, progress: number): Promise<ApiResponse> => {
      return api.put(`/assets/engineering-projects/${id}/progress`, { progress });
    }
  },

  // 可租赁单元相关
  units: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<Unit[]>> => {
      return api.get('/assets/units', { params });
    },
    
    get: (id: string): Promise<ApiResponse<Unit>> => {
      return api.get(`/assets/units/${id}`);
    },
    
    create: (data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Unit>> => {
      return api.post('/assets/units', data);
    },
    
    update: (id: string, data: Partial<Unit>): Promise<ApiResponse<Unit>> => {
      return api.put(`/assets/units/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/assets/units/${id}`);
    },

    // 获取可用单元
    getAvailable: (): Promise<ApiResponse<Unit[]>> => {
      return api.get('/assets/units/available');
    }
  },

  // 供应商相关
  suppliers: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<Supplier[]>> => {
      return api.get('/assets/suppliers', { params });
    },
    
    get: (id: string): Promise<ApiResponse<Supplier>> => {
      return api.get(`/assets/suppliers/${id}`);
    },
    
    create: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Supplier>> => {
      return api.post('/assets/suppliers', data);
    },
    
    update: (id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
      return api.put(`/assets/suppliers/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/assets/suppliers/${id}`);
    },

    // 供应商评级
    rate: (id: string, rating: number, feedback?: string): Promise<ApiResponse> => {
      return api.post(`/assets/suppliers/${id}/rate`, { rating, feedback });
    }
  }
};

// ===================客户生命周期API===================
export const clientApi = {
  // 客户相关
  clients: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<Client[]>> => {
      return api.get('/clients', { params });
    },
    
    get: (id: string): Promise<ApiResponse<Client>> => {
      return api.get(`/clients/${id}`);
    },
    
    create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> => {
      return api.post('/clients', data);
    },
    
    update: (id: string, data: Partial<Client>): Promise<ApiResponse<Client>> => {
      return api.put(`/clients/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/clients/${id}`);
    },

    // 获取我的客户（销售员）
    getMy: (): Promise<ApiResponse<Client[]>> => {
      return api.get('/clients/my');
    },

    // 添加跟进记录
    addFollowUp: (clientId: string, data: any): Promise<ApiResponse> => {
      return api.post(`/clients/${clientId}/follow-up`, data);
    }
  },

  // 租赁合同相关
  contracts: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<RentalContract[]>> => {
      return api.get('/clients/contracts', { params });
    },
    
    get: (id: string): Promise<ApiResponse<RentalContract>> => {
      return api.get(`/clients/contracts/${id}`);
    },
    
    create: (data: Omit<RentalContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<RentalContract>> => {
      return api.post('/clients/contracts', data);
    },
    
    update: (id: string, data: Partial<RentalContract>): Promise<ApiResponse<RentalContract>> => {
      return api.put(`/clients/contracts/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/clients/contracts/${id}`);
    },

    // 合同审批
    approve: (id: string): Promise<ApiResponse> => {
      return api.post(`/clients/contracts/${id}/approve`);
    },

    // 合同签署
    sign: (id: string, signDate: string): Promise<ApiResponse> => {
      return api.post(`/clients/contracts/${id}/sign`, { signDate });
    },

    // 合同激活
    activate: (id: string): Promise<ApiResponse> => {
      return api.post(`/clients/contracts/${id}/activate`);
    },

    // 合同终止
    terminate: (id: string, reason: string): Promise<ApiResponse> => {
      return api.post(`/clients/contracts/${id}/terminate`, { reason });
    }
  },

  // 收款单相关
  paymentOrders: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaymentOrder[]>> => {
      return api.get('/clients/payment-orders', { params });
    },
    
    get: (id: string): Promise<ApiResponse<PaymentOrder>> => {
      return api.get(`/clients/payment-orders/${id}`);
    },
    
    create: (data: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PaymentOrder>> => {
      return api.post('/clients/payment-orders', data);
    },
    
    update: (id: string, data: Partial<PaymentOrder>): Promise<ApiResponse<PaymentOrder>> => {
      return api.put(`/clients/payment-orders/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/clients/payment-orders/${id}`);
    },

    // 确认付款
    confirmPayment: (id: string, data: { paidAmount: number; paymentMethod: string; reference?: string }): Promise<ApiResponse> => {
      return api.post(`/clients/payment-orders/${id}/confirm`, data);
    },

    // 批量生成收款单
    batchGenerate: (contractIds: string[], billingPeriod: string): Promise<ApiResponse> => {
      return api.post('/clients/payment-orders/batch-generate', { contractIds, billingPeriod });
    }
  },

  // 客户服务相关
  services: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<ClientService[]>> => {
      return api.get('/clients/services', { params });
    },
    
    get: (id: string): Promise<ApiResponse<ClientService>> => {
      return api.get(`/clients/services/${id}`);
    },
    
    create: (data: Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ClientService>> => {
      return api.post('/clients/services', data);
    },
    
    update: (id: string, data: Partial<ClientService>): Promise<ApiResponse<ClientService>> => {
      return api.put(`/clients/services/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/clients/services/${id}`);
    },

    // 更新服务进度
    updateProgress: (id: string, progress: number): Promise<ApiResponse> => {
      return api.put(`/clients/services/${id}/progress`, { progress });
    }
  }
};

// ===================财务相关API===================
export const financeApi = {
  // 项目支出相关
  expenses: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<ProjectExpense[]>> => {
      return api.get('/finance/expenses', { params });
    },
    
    get: (id: string): Promise<ApiResponse<ProjectExpense>> => {
      return api.get(`/finance/expenses/${id}`);
    },
    
    create: (data: Omit<ProjectExpense, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProjectExpense>> => {
      return api.post('/finance/expenses', data);
    },
    
    update: (id: string, data: Partial<ProjectExpense>): Promise<ApiResponse<ProjectExpense>> => {
      return api.put(`/finance/expenses/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/finance/expenses/${id}`);
    },

    // 支出审批
    approve: (id: string): Promise<ApiResponse> => {
      return api.post(`/finance/expenses/${id}/approve`);
    },

    // 确认付款
    confirmPayment: (id: string, data: { paymentDate: string; paymentMethod: string }): Promise<ApiResponse> => {
      return api.post(`/finance/expenses/${id}/pay`, data);
    }
  },

  // 佣金结算相关
  commissions: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<CommissionSettlement[]>> => {
      return api.get('/finance/commissions', { params });
    },
    
    get: (id: string): Promise<ApiResponse<CommissionSettlement>> => {
      return api.get(`/finance/commissions/${id}`);
    },
    
    create: (data: Omit<CommissionSettlement, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CommissionSettlement>> => {
      return api.post('/finance/commissions', data);
    },
    
    update: (id: string, data: Partial<CommissionSettlement>): Promise<ApiResponse<CommissionSettlement>> => {
      return api.put(`/finance/commissions/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/finance/commissions/${id}`);
    },

    // 计算佣金
    calculate: (salesPerson: string, period: string): Promise<ApiResponse<CommissionSettlement>> => {
      return api.post('/finance/commissions/calculate', { salesPerson, period });
    },

    // 确认支付佣金
    confirmPayment: (id: string): Promise<ApiResponse> => {
      return api.post(`/finance/commissions/${id}/pay`);
    }
  },

  // 发票相关
  invoices: {
    list: (params?: PaginationParams & FilterParams): Promise<ApiResponse<Invoice[]>> => {
      return api.get('/finance/invoices', { params });
    },
    
    get: (id: string): Promise<ApiResponse<Invoice>> => {
      return api.get(`/finance/invoices/${id}`);
    },
    
    create: (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Invoice>> => {
      return api.post('/finance/invoices', data);
    },
    
    update: (id: string, data: Partial<Invoice>): Promise<ApiResponse<Invoice>> => {
      return api.put(`/finance/invoices/${id}`, data);
    },
    
    delete: (id: string): Promise<ApiResponse> => {
      return api.delete(`/finance/invoices/${id}`);
    },

    // 开具发票
    issue: (id: string): Promise<ApiResponse> => {
      return api.post(`/finance/invoices/${id}/issue`);
    }
  },

  // 财务报表
  reports: {
    // 收入报表
    revenue: (startDate: string, endDate: string): Promise<ApiResponse> => {
      return api.get('/finance/reports/revenue', { params: { startDate, endDate } });
    },

    // 支出报表
    expense: (startDate: string, endDate: string): Promise<ApiResponse> => {
      return api.get('/finance/reports/expense', { params: { startDate, endDate } });
    },

    // 利润报表
    profit: (startDate: string, endDate: string): Promise<ApiResponse> => {
      return api.get('/finance/reports/profit', { params: { startDate, endDate } });
    },

    // 回款分析
    collection: (startDate: string, endDate: string): Promise<ApiResponse> => {
      return api.get('/finance/reports/collection', { params: { startDate, endDate } });
    }
  }
};

// ===================报表相关API===================
export const reportingApi = {
  // 销控图数据
  salesChart: (): Promise<ApiResponse> => {
    return api.get('/reporting/sales-chart');
  },

  // 业务数据大屏
  businessDashboard: (): Promise<ApiResponse> => {
    return api.get('/reporting/business-dashboard');
  },

  // 项目进度总览
  projectOverview: (): Promise<ApiResponse> => {
    return api.get('/reporting/project-overview');
  },

  // 自定义报表
  customReport: (config: any): Promise<ApiResponse> => {
    return api.post('/reporting/custom', config);
  }
};

// 模拟数据API（用于开发测试）
export const mockApi = {
  // 模拟登录
  login: async (username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 简单的密码验证：用户名和密码相同
    if (username !== password) {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }

    let user: User;
    
    switch (username) {
      case 'admin':
        user = {
          id: '1',
          username: 'admin',
          name: '系统管理员',
          role: UserRole.ADMIN,
          department: '总经办',
          permissions: [],
          email: 'admin@company.com'
        };
        break;
      case 'sales':
        user = {
          id: '2',
          username: 'sales',
          name: '张销售',
          role: UserRole.SALES_MANAGER,
          department: '销售部',
          permissions: [],
          email: 'sales@company.com'
        };
        break;
      case 'finance':
        user = {
          id: '3',
          username: 'finance',
          name: '李财务',
          role: UserRole.FINANCE,
          department: '财务部',
          permissions: [],
          email: 'finance@company.com'
        };
        break;
      case 'engineer':
        user = {
          id: '4',
          username: 'engineer',
          name: '王工程师',
          role: UserRole.ENGINEER,
          department: '工程部',
          permissions: [],
          email: 'engineer@company.com'
        };
        break;
      case 'service':
        user = {
          id: '5',
          username: 'service',
          name: '刘企服',
          role: UserRole.SERVICE_STAFF,
          department: '企服部',
          permissions: [],
          email: 'service@company.com'
        };
        break;
      case 'project':
        user = {
          id: '6',
          username: 'project',
          name: '陈项目经理',
          role: UserRole.PROJECT_DEV,
          department: '项目部',
          permissions: [],
          email: 'project@company.com'
        };
        break;
      case 'operator':
        user = {
          id: '7',
          username: 'operator',
          name: '赵运营',
          role: UserRole.OPERATOR,
          department: '运营部',
          permissions: [],
          email: 'operator@company.com'
        };
        break;
      default:
        return {
          success: false,
          message: '用户名或密码错误'
        };
    }

    return {
      success: true,
      user,
      token: `mock-jwt-token-${username}`
    };
  },

  // 模拟KPI数据
  getKPIData: async (): Promise<KPIData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      asset: {
        totalUnits: 120,
        rentedUnits: 98,
        vacantUnits: 22,
        renovatingUnits: 5,
        occupancyRate: 81.7,
        averageRent: 4500
      },
      finance: {
        totalRevenue: 2450000,
        totalExpense: 1890000,
        netProfit: 560000,
        receivableAmount: 1250000,
        receivedAmount: 980000,
        overdueAmount: 150000,
        collectionRate: 78.4
      },
      project: {
        inProgressProjects: 8,
        completedProjects: 15,
        delayedProjects: 2,
        averageProgress: 67.5
      },
      client: {
        totalClients: 156,
        activeClients: 98,
        newClientsThisMonth: 12,
        contractsThisMonth: 8,
        averageContractValue: 156000
      }
    };
  }
};

export default api; 