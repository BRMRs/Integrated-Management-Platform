import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
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
  ClientService,
  ApiResponse
} from '../types';

// 用户认证状态
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

// 应用全局状态
interface AppState {
  // KPI数据
  kpiData: KPIData | null;
  setKpiData: (data: KPIData) => void;
  fetchKpiData: () => Promise<void>;
  
  // 待办事项
  todoItems: TodoItem[];
  setTodoItems: (items: TodoItem[]) => void;
  addTodoItem: (item: TodoItem) => void;
  updateTodoItem: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodoItem: (id: string) => void;
  
  // 全局加载状态
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

// 资产生命周期状态
interface AssetLifecycleState {
  // 潜在项目
  potentialProjects: PotentialProject[];
  setPotentialProjects: (projects: PotentialProject[]) => void;
  addPotentialProject: (project: PotentialProject) => void;
  updatePotentialProject: (id: string, updates: Partial<PotentialProject>) => void;
  deletePotentialProject: (id: string) => void;

  // 签约项目
  signedProjects: SignedProject[];
  setSignedProjects: (projects: SignedProject[]) => void;
  addSignedProject: (project: SignedProject) => void;
  updateSignedProject: (id: string, updates: Partial<SignedProject>) => void;
  deleteSignedProject: (id: string) => void;

  // 工程项目
  engineeringProjects: EngineeringProject[];
  setEngineeringProjects: (projects: EngineeringProject[]) => void;
  addEngineeringProject: (project: EngineeringProject) => void;
  updateEngineeringProject: (id: string, updates: Partial<EngineeringProject>) => void;
  deleteEngineeringProject: (id: string) => void;

  // 可租赁单元
  units: Unit[];
  setUnits: (units: Unit[]) => void;
  addUnit: (unit: Unit) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  // 供应商
  suppliers: Supplier[];
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

// 客户生命周期状态
interface ClientLifecycleState {
  // 客户
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // 租赁合同
  rentalContracts: RentalContract[];
  setRentalContracts: (contracts: RentalContract[]) => void;
  addRentalContract: (contract: RentalContract) => void;
  updateRentalContract: (id: string, updates: Partial<RentalContract>) => void;
  deleteRentalContract: (id: string) => void;

  // 收款单
  paymentOrders: PaymentOrder[];
  setPaymentOrders: (orders: PaymentOrder[]) => void;
  addPaymentOrder: (order: PaymentOrder) => void;
  updatePaymentOrder: (id: string, updates: Partial<PaymentOrder>) => void;
  deletePaymentOrder: (id: string) => void;

  // 客户服务
  clientServices: ClientService[];
  setClientServices: (services: ClientService[]) => void;
  addClientService: (service: ClientService) => void;
  updateClientService: (id: string, updates: Partial<ClientService>) => void;
  deleteClientService: (id: string) => void;
}

// 财务状态
interface FinanceState {
  // 项目支出
  projectExpenses: ProjectExpense[];
  setProjectExpenses: (expenses: ProjectExpense[]) => void;
  addProjectExpense: (expense: ProjectExpense) => void;
  updateProjectExpense: (id: string, updates: Partial<ProjectExpense>) => void;
  deleteProjectExpense: (id: string) => void;

  // 佣金结算
  commissionSettlements: CommissionSettlement[];
  setCommissionSettlements: (settlements: CommissionSettlement[]) => void;
  addCommissionSettlement: (settlement: CommissionSettlement) => void;
  updateCommissionSettlement: (id: string, updates: Partial<CommissionSettlement>) => void;
  deleteCommissionSettlement: (id: string) => void;

  // 发票
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

// 组合所有状态
type GlobalState = AuthState & AppState & AssetLifecycleState & ClientLifecycleState & FinanceState;

// 创建全局状态store
export const useAppStore = create<GlobalState>()(
  devtools(
    (set, get) => ({
      // =================== 认证状态 ===================
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (username: string, password: string) => {
        set({ loading: true });
        try {
          // 这里应该调用实际的登录API
          // 模拟登录逻辑
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 模拟用户数据 - 根据用户名映射不同角色
          let mockUser: User;

          switch (username) {
            case 'admin':
              mockUser = {
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
              mockUser = {
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
              mockUser = {
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
              mockUser = {
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
              mockUser = {
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
              mockUser = {
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
              mockUser = {
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
              // 如果用户名不匹配，返回登录失败
              set({ loading: false });
              return false;
          }

          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            loading: false 
          });
          
          // 保存token到localStorage
          localStorage.setItem('token', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          return true;
        } catch (error) {
          set({ loading: false });
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      updateUserProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      },

      // =================== 应用状态 ===================
      kpiData: null,
      setKpiData: (data) => set({ kpiData: data }),
      
      fetchKpiData: async () => {
        set({ globalLoading: true });
        try {
          // 这里应该调用实际的API
          // 模拟数据
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockKPIData: KPIData = {
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
          set({ kpiData: mockKPIData });
        } catch (error) {
          console.error('Failed to fetch KPI data:', error);
        } finally {
          set({ globalLoading: false });
        }
      },

      todoItems: [],
      setTodoItems: (items) => set({ todoItems: items }),
      addTodoItem: (item) => set((state) => ({ 
        todoItems: [...state.todoItems, item] 
      })),
      updateTodoItem: (id, updates) => set((state) => ({
        todoItems: state.todoItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      deleteTodoItem: (id) => set((state) => ({
        todoItems: state.todoItems.filter(item => item.id !== id)
      })),

      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // =================== 资产生命周期状态 ===================
      potentialProjects: [],
      setPotentialProjects: (projects) => set({ potentialProjects: projects }),
      addPotentialProject: (project) => set((state) => ({ 
        potentialProjects: [...state.potentialProjects, project] 
      })),
      updatePotentialProject: (id, updates) => set((state) => ({
        potentialProjects: state.potentialProjects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      })),
      deletePotentialProject: (id) => set((state) => ({
        potentialProjects: state.potentialProjects.filter(project => project.id !== id)
      })),

      signedProjects: [],
      setSignedProjects: (projects) => set({ signedProjects: projects }),
      addSignedProject: (project) => set((state) => ({ 
        signedProjects: [...state.signedProjects, project] 
      })),
      updateSignedProject: (id, updates) => set((state) => ({
        signedProjects: state.signedProjects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      })),
      deleteSignedProject: (id) => set((state) => ({
        signedProjects: state.signedProjects.filter(project => project.id !== id)
      })),

      engineeringProjects: [],
      setEngineeringProjects: (projects) => set({ engineeringProjects: projects }),
      addEngineeringProject: (project) => set((state) => ({ 
        engineeringProjects: [...state.engineeringProjects, project] 
      })),
      updateEngineeringProject: (id, updates) => set((state) => ({
        engineeringProjects: state.engineeringProjects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      })),
      deleteEngineeringProject: (id) => set((state) => ({
        engineeringProjects: state.engineeringProjects.filter(project => project.id !== id)
      })),

      units: [],
      setUnits: (units) => set({ units }),
      addUnit: (unit) => set((state) => ({ 
        units: [...state.units, unit] 
      })),
      updateUnit: (id, updates) => set((state) => ({
        units: state.units.map(unit => 
          unit.id === id ? { ...unit, ...updates } : unit
        )
      })),
      deleteUnit: (id) => set((state) => ({
        units: state.units.filter(unit => unit.id !== id)
      })),

      suppliers: [],
      setSuppliers: (suppliers) => set({ suppliers }),
      addSupplier: (supplier) => set((state) => ({ 
        suppliers: [...state.suppliers, supplier] 
      })),
      updateSupplier: (id, updates) => set((state) => ({
        suppliers: state.suppliers.map(supplier => 
          supplier.id === id ? { ...supplier, ...updates } : supplier
        )
      })),
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(supplier => supplier.id !== id)
      })),

      // =================== 客户生命周期状态 ===================
      clients: [],
      setClients: (clients) => set({ clients }),
      addClient: (client) => set((state) => ({ 
        clients: [...state.clients, client] 
      })),
      updateClient: (id, updates) => set((state) => ({
        clients: state.clients.map(client => 
          client.id === id ? { ...client, ...updates } : client
        )
      })),
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(client => client.id !== id)
      })),

      rentalContracts: [],
      setRentalContracts: (contracts) => set({ rentalContracts: contracts }),
      addRentalContract: (contract) => set((state) => ({ 
        rentalContracts: [...state.rentalContracts, contract] 
      })),
      updateRentalContract: (id, updates) => set((state) => ({
        rentalContracts: state.rentalContracts.map(contract => 
          contract.id === id ? { ...contract, ...updates } : contract
        )
      })),
      deleteRentalContract: (id) => set((state) => ({
        rentalContracts: state.rentalContracts.filter(contract => contract.id !== id)
      })),

      paymentOrders: [],
      setPaymentOrders: (orders) => set({ paymentOrders: orders }),
      addPaymentOrder: (order) => set((state) => ({ 
        paymentOrders: [...state.paymentOrders, order] 
      })),
      updatePaymentOrder: (id, updates) => set((state) => ({
        paymentOrders: state.paymentOrders.map(order => 
          order.id === id ? { ...order, ...updates } : order
        )
      })),
      deletePaymentOrder: (id) => set((state) => ({
        paymentOrders: state.paymentOrders.filter(order => order.id !== id)
      })),

      clientServices: [],
      setClientServices: (services) => set({ clientServices: services }),
      addClientService: (service) => set((state) => ({ 
        clientServices: [...state.clientServices, service] 
      })),
      updateClientService: (id, updates) => set((state) => ({
        clientServices: state.clientServices.map(service => 
          service.id === id ? { ...service, ...updates } : service
        )
      })),
      deleteClientService: (id) => set((state) => ({
        clientServices: state.clientServices.filter(service => service.id !== id)
      })),

      // =================== 财务状态 ===================
      projectExpenses: [],
      setProjectExpenses: (expenses) => set({ projectExpenses: expenses }),
      addProjectExpense: (expense) => set((state) => ({ 
        projectExpenses: [...state.projectExpenses, expense] 
      })),
      updateProjectExpense: (id, updates) => set((state) => ({
        projectExpenses: state.projectExpenses.map(expense => 
          expense.id === id ? { ...expense, ...updates } : expense
        )
      })),
      deleteProjectExpense: (id) => set((state) => ({
        projectExpenses: state.projectExpenses.filter(expense => expense.id !== id)
      })),

      commissionSettlements: [],
      setCommissionSettlements: (settlements) => set({ commissionSettlements: settlements }),
      addCommissionSettlement: (settlement) => set((state) => ({ 
        commissionSettlements: [...state.commissionSettlements, settlement] 
      })),
      updateCommissionSettlement: (id, updates) => set((state) => ({
        commissionSettlements: state.commissionSettlements.map(settlement => 
          settlement.id === id ? { ...settlement, ...updates } : settlement
        )
      })),
      deleteCommissionSettlement: (id) => set((state) => ({
        commissionSettlements: state.commissionSettlements.filter(settlement => settlement.id !== id)
      })),

      invoices: [],
      setInvoices: (invoices) => set({ invoices }),
      addInvoice: (invoice) => set((state) => ({ 
        invoices: [...state.invoices, invoice] 
      })),
      updateInvoice: (id, updates) => set((state) => ({
        invoices: state.invoices.map(invoice => 
          invoice.id === id ? { ...invoice, ...updates } : invoice
        )
      })),
      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(invoice => invoice.id !== id)
      })),
    }),
    {
      name: 'lifecycle-management-store'
    }
  )
);

// 便利的选择器函数
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  loading: state.loading,
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  updateUserProfile: state.updateUserProfile
}));

export const useKpiData = () => useAppStore((state) => state.kpiData);
export const useTodoItems = () => useAppStore((state) => state.todoItems);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);

// 资产生命周期相关选择器
export const usePotentialProjects = () => useAppStore((state) => state.potentialProjects);
export const useSignedProjects = () => useAppStore((state) => state.signedProjects);
export const useEngineeringProjects = () => useAppStore((state) => state.engineeringProjects);
export const useUnits = () => useAppStore((state) => state.units);
export const useSuppliers = () => useAppStore((state) => state.suppliers);

// 客户生命周期相关选择器
export const useClients = () => useAppStore((state) => state.clients);
export const useRentalContracts = () => useAppStore((state) => state.rentalContracts);
export const usePaymentOrders = () => useAppStore((state) => state.paymentOrders);
export const useClientServices = () => useAppStore((state) => state.clientServices);

// 财务相关选择器
export const useProjectExpenses = () => useAppStore((state) => state.projectExpenses);
export const useCommissionSettlements = () => useAppStore((state) => state.commissionSettlements);
export const useInvoices = () => useAppStore((state) => state.invoices); 