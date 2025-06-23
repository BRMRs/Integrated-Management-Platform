import { UserRole, MenuItem, Permission } from '../types';
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
  DollarOutlined,
  BarChartOutlined,
  BuildOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  AccountBookOutlined,
  SettingOutlined,
  DatabaseOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BankOutlined,
  ToolOutlined,
  HomeOutlined,
  ContactsOutlined,
  SolutionOutlined,
  MoneyCollectOutlined,
  ReconciliationOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TableOutlined
} from '@ant-design/icons';

// 角色权限配置
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'procurement', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'engineering', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'sales', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'service', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'finance', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'reporting', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'system', actions: ['read', 'create', 'update', 'delete'] }
  ],
  
  [UserRole.PROJECT_DEV]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'procurement', actions: ['read', 'create', 'update'] },
    { module: 'engineering', actions: ['read', 'update'] },
    { module: 'sales', actions: ['read'] },
    { module: 'finance', actions: ['read'] }
  ],
  
  [UserRole.ENGINEER]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'engineering', actions: ['read', 'create', 'update'] },
    { module: 'procurement', actions: ['read'] },
    { module: 'finance', actions: ['read'] }
  ],
  
  [UserRole.SALES_MANAGER]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'sales', actions: ['read', 'create', 'update'] },
    { module: 'service', actions: ['read', 'update'] },
    { module: 'finance', actions: ['read'] }
  ],
  
  [UserRole.SERVICE_STAFF]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'service', actions: ['read', 'create', 'update'] },
    { module: 'sales', actions: ['read'] }
  ],
  
  [UserRole.FINANCE]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'finance', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'sales', actions: ['read'] },
    { module: 'procurement', actions: ['read'] },
    { module: 'reporting', actions: ['read'] }
  ],
  
  [UserRole.OPERATOR]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'sales', actions: ['read'] },
    { module: 'finance', actions: ['read'] },
    { module: 'reporting', actions: ['read'] }
  ]
};

// 动态菜单配置
export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '主控台',
    icon: DashboardOutlined,
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.PROJECT_DEV, UserRole.ENGINEER, UserRole.SALES_MANAGER, UserRole.SERVICE_STAFF, UserRole.FINANCE, UserRole.OPERATOR]
  },
  {
    key: 'procurement',
    label: '采购与项目开发',
    icon: ProjectOutlined,
    roles: [UserRole.ADMIN, UserRole.PROJECT_DEV],
    children: [
      {
        key: 'potential-projects',
        label: '潜在项目池',
        icon: DatabaseOutlined,
        path: '/procurement/potential-projects',
        roles: [UserRole.ADMIN, UserRole.PROJECT_DEV]
      },
      {
        key: 'signed-projects',
        label: '已签约项目管理',
        icon: FileTextOutlined,
        path: '/procurement/signed-projects',
        roles: [UserRole.ADMIN, UserRole.PROJECT_DEV]
      },
      {
        key: 'suppliers',
        label: '供应商管理',
        icon: TeamOutlined,
        path: '/procurement/suppliers',
        roles: [UserRole.ADMIN, UserRole.PROJECT_DEV]
      }
    ]
  },
  {
    key: 'engineering',
    label: '工程管理',
    icon: BuildOutlined,
    roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.PROJECT_DEV],
    children: [
      {
        key: 'engineering-contracts',
        label: '工程合同',
        icon: SolutionOutlined,
        path: '/engineering/contracts',
        roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.PROJECT_DEV]
      },
      {
        key: 'design-documents',
        label: '设计文档库',
        icon: FileTextOutlined,
        path: '/engineering/documents',
        roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.PROJECT_DEV]
      },
      {
        key: 'construction-progress',
        label: '施工进度跟踪',
        icon: CalendarOutlined,
        path: '/engineering/progress',
        roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.PROJECT_DEV]
      },
      {
        key: 'engineering-acceptance',
        label: '工程验收',
        icon: ToolOutlined,
        path: '/engineering/acceptance',
        roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.PROJECT_DEV]
      }
    ]
  },
  {
    key: 'sales',
    label: '销售与客户管理',
    icon: UserOutlined,
    roles: [UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.SERVICE_STAFF],
    children: [
      {
        key: 'my-clients',
        label: '我的客户',
        icon: ContactsOutlined,
        path: '/sales/my-clients',
        roles: [UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.SERVICE_STAFF]
      },
      {
        key: 'contract-management',
        label: '合同管理',
        icon: SolutionOutlined,
        path: '/sales/contracts',
        roles: [UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.SERVICE_STAFF]
      },
      {
        key: 'unit-info',
        label: '房源信息库',
        icon: HomeOutlined,
        path: '/sales/units',
        roles: [UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.SERVICE_STAFF]
      }
    ]
  },
  {
    key: 'service',
    label: '客户服务',
    icon: CustomerServiceOutlined,
    roles: [UserRole.ADMIN, UserRole.SERVICE_STAFF, UserRole.SALES_MANAGER],
    children: [
      {
        key: 'company-registration',
        label: '公司注册跟进',
        icon: BankOutlined,
        path: '/service/registration',
        roles: [UserRole.ADMIN, UserRole.SERVICE_STAFF, UserRole.SALES_MANAGER]
      },
      {
        key: 'contract-changes',
        label: '合同变更管理',
        icon: ReconciliationOutlined,
        path: '/service/contract-changes',
        roles: [UserRole.ADMIN, UserRole.SERVICE_STAFF, UserRole.SALES_MANAGER]
      },
      {
        key: 'payment-notices',
        label: '付款通知',
        icon: MoneyCollectOutlined,
        path: '/service/payment-notices',
        roles: [UserRole.ADMIN, UserRole.SERVICE_STAFF, UserRole.SALES_MANAGER]
      }
    ]
  },
  {
    key: 'finance',
    label: '财务中心',
    icon: DollarOutlined,
    roles: [UserRole.ADMIN, UserRole.FINANCE],
    children: [
      {
        key: 'project-expenses',
        label: '项目成本支付',
        icon: AccountBookOutlined,
        path: '/finance/project-expenses',
        roles: [UserRole.ADMIN, UserRole.FINANCE]
      },
      {
        key: 'rent-collection',
        label: '租金收缴管理',
        icon: MoneyCollectOutlined,
        path: '/finance/rent-collection',
        roles: [UserRole.ADMIN, UserRole.FINANCE]
      },
      {
        key: 'commission-settlement',
        label: '佣金结算',
        icon: BankOutlined,
        path: '/finance/commission',
        roles: [UserRole.ADMIN, UserRole.FINANCE]
      },
      {
        key: 'invoice-management',
        label: '发票管理',
        icon: FileTextOutlined,
        path: '/finance/invoices',
        roles: [UserRole.ADMIN, UserRole.FINANCE]
      },
      {
        key: 'financial-reports',
        label: '财务报表',
        icon: BarChartOutlined,
        path: '/finance/reports',
        roles: [UserRole.ADMIN, UserRole.FINANCE]
      }
    ]
  },
  {
    key: 'reporting',
    label: '商业智能与报表',
    icon: BarChartOutlined,
    roles: [UserRole.ADMIN],
    children: [
      {
        key: 'sales-chart',
        label: '销售控制图表',
        icon: PieChartOutlined,
        path: '/reporting/sales-chart',
        roles: [UserRole.ADMIN]
      },
      {
        key: 'business-dashboard',
        label: '业务数据看板',
        icon: LineChartOutlined,
        path: '/reporting/dashboard',
        roles: [UserRole.ADMIN]
      },
      {
        key: 'project-overview',
        label: '项目进度总览',
        icon: TableOutlined,
        path: '/reporting/project-overview',
        roles: [UserRole.ADMIN]
      }
    ]
  }
];

// 权限检查函数
export const hasPermission = (userRole: UserRole, module: string, action: string): boolean => {
  const permissions = rolePermissions[userRole];
  const modulePermission = permissions.find(p => p.module === module);
  return modulePermission ? modulePermission.actions.includes(action) : false;
};

// 检查用户是否可以看到某个菜单项
export const canAccessMenuItem = (userRole: UserRole, menuItem: MenuItem): boolean => {
  return menuItem.roles.includes(userRole);
};

// 根据角色过滤菜单
export const getMenuForRole = (userRole: UserRole): MenuItem[] => {
  const filterMenu = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => canAccessMenuItem(userRole, item))
      .map(item => ({
        ...item,
        children: item.children ? filterMenu(item.children) : undefined
      }))
      .filter(item => !item.children || item.children.length > 0);
  };
  
  return filterMenu(menuConfig);
};

// 根据角色获取Dashboard配置
export const getDashboardConfig = (userRole: UserRole) => {
  switch (userRole) {
    case UserRole.ADMIN:
      return {
        showCompanyKPIs: true,
        showAllProjects: true,
        showAllClients: true,
        showFinancialOverview: true,
        showSystemAlerts: true
      };
    
    case UserRole.SALES_MANAGER:
      return {
        showPersonalKPIs: true,
        showMyClients: true,
        showMyContracts: true,
        showCommissionInfo: true,
        showFollowUpTasks: true
      };
    
    case UserRole.PROJECT_DEV:
      return {
        showProjectKPIs: true,
        showMyProjects: true,
        showSupplierInfo: true,
        showBudgetOverview: true,
        showProjectAlerts: true
      };
    
    case UserRole.ENGINEER:
      return {
        showEngineeringKPIs: true,
        showConstructionProgress: true,
        showProjectMilestones: true,
        showQualityIssues: true
      };
    
    case UserRole.SERVICE_STAFF:
      return {
        showServiceKPIs: true,
        showPendingServices: true,
        showClientRequests: true,
        showCompanyRegistrations: true
      };
    
    case UserRole.FINANCE:
      return {
        showFinancialKPIs: true,
        showPaymentOverview: true,
        showOutstandingPayments: true,
        showBudgetStatus: true,
        showFinancialAlerts: true
      };
    
    case UserRole.OPERATOR:
      return {
        showOperationalKPIs: true,
        showContractStatus: true,
        showCollectionProgress: true,
        showSystemReports: true
      };
    
    default:
      return {
        showBasicInfo: true
      };
  }
};

// 角色中文名称映射
export const roleNames: Record<UserRole, string> = {
  [UserRole.ADMIN]: '管理员',
  [UserRole.PROJECT_DEV]: '项目开发员',
  [UserRole.ENGINEER]: '工程负责人',
  [UserRole.SALES_MANAGER]: '销售经理',
  [UserRole.SERVICE_STAFF]: '企服专员',
  [UserRole.FINANCE]: '财务人员',
  [UserRole.OPERATOR]: '运营人员'
};

// 获取角色颜色
export const getRoleColor = (role: UserRole): string => {
  const colors = {
    [UserRole.ADMIN]: '#722ed1',
    [UserRole.PROJECT_DEV]: '#1890ff',
    [UserRole.ENGINEER]: '#52c41a',
    [UserRole.SALES_MANAGER]: '#fa8c16',
    [UserRole.SERVICE_STAFF]: '#eb2f96',
    [UserRole.FINANCE]: '#13c2c2',
    [UserRole.OPERATOR]: '#faad14'
  };
  return colors[role] || '#666666';
}; 