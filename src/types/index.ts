// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',                    // 管理员
  PROJECT_DEV = 'project_dev',        // 项目开发员
  ENGINEER = 'engineer',              // 工程负责人
  SALES_MANAGER = 'sales_manager',    // 销售经理
  SERVICE_STAFF = 'service_staff',    // 企服专员
  FINANCE = 'finance',                // 财务人员
  OPERATOR = 'operator'               // 运营人员
}

// 用户信息
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department: string;
  permissions: Permission[];
  avatar?: string;
  email?: string;
  phone?: string;
}

// 权限定义
export interface Permission {
  module: string;     // 模块名
  actions: string[];  // 可执行的操作：read, create, update, delete
}

// 导航菜单项
export interface MenuItem {
  key: string;
  label: string;
  icon?: any;
  children?: MenuItem[];
  roles: UserRole[];  // 可见角色
  path?: string;
}

// ===================资产生命周期相关===================

// 潜在项目（获取与开发阶段）
export interface PotentialProject {
  id: string;
  name: string;
  location: string;
  area: number;
  landlord: string;
  landlordContact: string;
  status: 'prospect' | 'negotiating' | 'approved' | 'rejected';
  estimatedCost: number;
  expectedRevenue: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 详细的潜在项目池接口
export interface DetailedPotentialProject {
  id: string;
  
  // 核心信息（所有阶段通用）
  name: string;                           // 潜在项目名称
  projectPhase: '市场调研' | '商务条款' | '签订合同' | '已放弃';  // 项目阶段
  priority: 'P0' | 'P1' | 'P2';          // 项目优先级
  nextFollowUpTime: string;               // 下次跟进时间
  followUpBy: string;                     // 跟进人
  notes?: string;                         // 备注

  // 市场调研阶段字段
  marketResearch?: {
    operationType: string[];              // 运营类型
    location: string;                     // 所在位置
    propertyOwnerInfo: string;            // 产权方及背景
    projectProgress: string;              // 项目跟进情况
    propertyCompany: string;              // 物业公司
    buildDate: string;                    // 楼宇建设时间
    historicalOperator: string;           // 历史运营商
    buildingStandard: '甲级' | '乙级' | '其他'; // 楼宇标准
    landType: string;                     // 土地类型
    decorationStatus: '毛坯' | '简装' | '精装' | '遗留装修'; // 场地装修情况
    isExclusive: boolean;                 // 是否独家
    marketPrice: number;                  // 市场价
    occupancyRate: number;                // 出租率(%)
    commercialFacilities: string;         // 商业配套情况
    accommodation: string;                // 住宿情况
    transportation: string;               // 交通情况
    parking: string;                      // 停车配套
    isIncubator: boolean;                 // 是否孵化器
    intentionLevel: number;               // 合作意向程度 (0-100)
  };

  // 商务条款阶段字段
  businessTerms?: {
    contact: string;                      // 联系人
    contactPhone: string;                 // 联系电话
    leaseArea: number;                    // 租赁面积
    leaseFloor: string;                   // 租赁楼层
    leasePrice: number;                   // 租赁单价
    leaseTerm: number;                    // 租赁年限
    paymentMethod: string;                // 付款方式
    startDate: string;                    // 起租日
    rentIncreases: RentIncrease[];        // 租金递增
    freeRentPeriods: FreeRentPeriod[];    // 租金免租期
    depositItems: string[];               // 租赁保证金包含项目
    firstPaymentDate: string;             // 首款支付日期
    depositPaymentDate: string;           // 保证金支付日期
    propertyFeePrice: number;             // 物业费单价
    propertyFeeCalculationMethod: 'independent' | 'sync_with_rent'; // 物业费计费方式
    propertyFeeFreeRentPeriods: FreeRentPeriod[]; // 物业费免租期
    intentionLevel: number;               // 合作意向程度 (0-100)
  };

  // 签订合同阶段字段
  contractSigned?: {
    partyA?: {                            // 甲方信息
      companyName: string;                // 企业单位
      taxNumber: string;                  // 统一社会信用代码/税号
      companyAddress: string;             // 公司地址
      legalRepresentative: string;        // 法定代表人
    };
    partyB?: {                            // 乙方信息
      companyName: string;                // 企业单位
      taxNumber: string;                  // 统一社会信用代码/税号
      companyAddress: string;             // 公司地址
      legalRepresentative: string;        // 法定代表人
    };
    contractFiles: ContractFile[];        // 合同文件
    contractTemplate?: {                  // 合同模板相关
      selectedTemplateId?: string;        // 选中的模板ID
      generatedContent?: string;          // 生成的合同内容
      templateVariables?: Record<string, any>; // 模板变量值
    };
  };

  // 已放弃阶段字段
  abandoned?: {
    reason: string;                       // 不再跟进的原因
  };
  
  // 跟进记录
  followUpRecords: ProjectFollowUpRecord[];     // 跟进记录数组
  lastFollowUpTime: string;              // 最后跟进时间
  lastFollowUpBy: string;                // 跟进人
  
  // 系统字段
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 租金递增信息
export interface RentIncrease {
  id?: string;
  increaseTime: string;                   // 递增时间
  increasedPrice: number;                 // 递增后单价
}

// 免租期信息
export interface FreeRentPeriod {
  id?: string;
  year: number;                           // 第几年
  days: number;                           // 免租天数
  startDate?: string;                     // 开始时间（可选）
  endDate?: string;                       // 结束时间（可选）
}

// 合同文件
export interface ContractFile {
  id: string;
  name: string;                           // 文件名
  url: string;                            // 文件URL
  uploadTime: string;                     // 上传时间
  fileSize: number;                       // 文件大小
}

// 合同模板
export interface ContractTemplate {
  id: string;
  name: string;                           // 模板名称
  description: string;                    // 模板描述
  type: 'lease' | 'service' | 'cooperation' | 'other'; // 模板类型
  content: string;                        // 模板内容（HTML或富文本）
  originalBuffer?: ArrayBuffer;           // 原始DOCX文件的二进制数据
  variables: TemplateVariable[];          // 模板变量
  isDefault: boolean;                     // 是否为默认模板
  isActive: boolean;                      // 是否启用
  isCustom: boolean;                      // 是否为用户上传的自定义模板
  fileFormat: 'html' | 'docx' | 'pdf';   // 模板文件格式
  originalFileName?: string;              // 原始文件名
  autoMapping: AutoFieldMapping;          // 自动字段映射配置
  createdBy: string;                      // 创建人
  createdAt: string;                      // 创建时间
  updatedAt: string;                      // 更新时间
  version: string;                        // 版本号
}

// 模板变量
export interface TemplateVariable {
  key: string;                            // 变量键名
  label: string;                          // 变量标签
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'array'; // 变量类型
  required: boolean;                      // 是否必填
  defaultValue?: any;                     // 默认值
  options?: string[];                     // 选项（当type为select时）
  description?: string;                   // 变量描述
  sourceField?: string;                   // 来源字段路径（如：businessTerms.leaseArea）
  autoExtract: boolean;                   // 是否自动提取
}

// 自动字段映射配置
export interface AutoFieldMapping {
  // 甲方信息映射
  partyA: {
    companyName: string;                  // 对应模板中的变量名
    taxNumber: string;
    companyAddress: string;
    legalRepresentative: string;
  };
  // 乙方信息映射
  partyB: {
    companyName: string;
    taxNumber: string;
    companyAddress: string;
    legalRepresentative: string;
  };
  // 项目基本信息映射
  project: {
    name: string;                         // 项目名称
    location: string;                     // 项目位置
  };
  // 商务条款映射
  businessTerms: {
    leaseArea: string;                    // 租赁面积
    leaseFloor: string;                   // 租赁楼层
    leasePrice: string;                   // 租赁单价
    leaseTerm: string;                    // 租赁年限
    startDate: string;                    // 起租日期
    endDate: string;                      // 结束日期
    paymentMethod: string;                // 付款方式
    propertyFeePrice: string;             // 物业费单价
    freeRentPeriods: string;              // 免租期列表
    depositAmount: string;                // 保证金金额
    monthlyRent: string;                  // 月租金
  };
}

// 模板上传配置
export interface TemplateUploadConfig {
  acceptedFormats: string[];              // 支持的文件格式
  maxFileSize: number;                    // 最大文件大小（字节）
  variablePattern: RegExp;                // 变量识别模式
  autoDetectFields: boolean;              // 是否自动检测字段
}

// 项目跟进记录（用于潜在项目）
export interface ProjectFollowUpRecord {
  id: string;
  content: string;                       // 跟进内容
  user: string;                          // 跟进人
  time: string;                          // 跟进时间
}

// 签约项目（与业主签约的场地）
export interface SignedProject {
  id: string;
  name: string;
  contractWithLandlord: string;  // 与业主的合同编号
  location: string;
  totalArea: number;
  landlord: string;
  landlordContact?: string;      // 业主联系方式
  rentToLandlord: number;        // 支付给业主的租金
  contractStartDate: string;
  contractEndDate: string;
  status: 'designing' | 'construction' | 'completed' | 'operational';
  manager: string;
  progress: number;
  budget: number;
  spent: number;
  units: Unit[];                 // 该项目包含的可租赁单元
  
  // 从潜在项目转换来的附加信息
  potentialProjectId?: string;   // 来源潜在项目ID
  leaseFloor?: string;           // 租赁楼层
  leasePrice?: number;           // 租赁单价
  leaseTerm?: number;            // 租赁年限
  paymentMethod?: string;        // 付款方式
  rentIncreases?: RentIncrease[]; // 租金递增
  freeRentPeriods?: FreeRentPeriod[]; // 租金免租期
  depositItems?: string[];       // 租赁保证金包含项目
  firstPaymentDate?: string;     // 首款支付日期
  depositPaymentDate?: string;   // 保证金支付日期
  propertyFeePrice?: number;     // 物业费单价
  propertyFeeCalculationMethod?: 'independent' | 'sync_with_rent'; // 物业费计费方式
  propertyFeeFreeRentPeriods?: FreeRentPeriod[]; // 物业费免租期
  
  // 合同双方信息
  partyA?: {                     // 甲方信息
    companyName: string;         // 企业单位
    taxNumber: string;           // 统一社会信用代码/税号
    companyAddress: string;      // 公司地址
    legalRepresentative: string; // 法定代表人
  };
  partyB?: {                     // 乙方信息
    companyName: string;         // 企业单位
    taxNumber: string;           // 统一社会信用代码/税号
    companyAddress: string;      // 公司地址
    legalRepresentative: string; // 法定代表人
  };
  contractFiles?: ContractFile[]; // 合同文件
  
  // 合同金额信息
  contractAmounts?: {
    totalRentAmount: number;     // 租金总额
    totalPropertyFeeAmount: number; // 物业费总额
    totalContractAmount: number; // 合同总金额
    yearlyBreakdown: any[];      // 年度明细
  };
  
  createdAt: string;
  updatedAt: string;
}

// 工程管理
export interface EngineeringProject {
  id: string;
  projectId: string;             // 关联的签约项目ID
  projectName: string;
  type: 'design' | 'construction' | 'renovation';
  contractor: string;
  contractAmount: number;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  documents: Document[];         // 设计图纸等文档
  milestones: Milestone[];       // 工程里程碑
  manager: string;
  createdAt: string;
  updatedAt: string;
}

// 工程里程碑
export interface Milestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: 'pending' | 'completed' | 'delayed';
  description?: string;
}

// 文档管理
export interface Document {
  id: string;
  name: string;
  type: 'design' | 'contract' | 'certificate' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  version?: string;
}

// 可租赁单元
export interface Unit {
  id: string;
  projectId: string;
  building: string;
  floor: number;
  roomNumber: string;
  area: number;
  status: 'vacant' | 'rented' | 'renovating' | 'reserved' | 'maintenance';
  rentPrice: number;
  managementFee: number;
  deposit: number;
  tenantId?: string;
  tenantName?: string;
  contractId?: string;
  availableDate?: string;
  features: string[];            // 房间特性：朝向、装修等
  createdAt: string;
  updatedAt: string;
}

// ===================客户生命周期相关===================

// 客户（租户）
export interface Client {
  id: string;
  name: string;
  type: 'company' | 'individual';
  industry?: string;
  businessScope?: string;
  legalRepresentative?: string;
  unifiedSocialCreditCode?: string;  // 统一社会信用代码
  registeredAddress?: string;
  operatingAddress?: string;
  contact: string;
  contactTitle?: string;
  phone: string;
  email?: string;
  wechat?: string;
  source: 'referral' | 'online' | 'exhibition' | 'cold_call' | 'other';
  status: 'prospect' | 'following' | 'pending_approval' | 'signed' | 'terminated';
  assignedSales: string;         // 负责销售
  followUpHistory: FollowUpRecord[];
  contractCount: number;
  totalRentAmount: number;
  creditRating: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 客户跟进记录
export interface FollowUpRecord {
  id: string;
  clientId: string;
  type: 'call' | 'visit' | 'email' | 'wechat' | 'meeting';
  content: string;
  nextFollowUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

// 租赁合同
export interface RentalContract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  unitId: string;
  roomNumber: string;
  contractType: 'new' | 'renewal' | 'transfer';
  startDate: string;
  endDate: string;
  rentAmount: number;            // 月租金
  managementFee: number;         // 月物业费
  depositAmount: number;         // 押金
  freeRentPeriod: number;        // 免租期（天）
  paymentCycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  status: 'draft' | 'pending_approval' | 'approved' | 'signed' | 'active' | 'expired' | 'terminated';
  signDate?: string;
  activationDate?: string;
  terminationDate?: string;
  salesPerson: string;
  approvedBy?: string;
  commission: number;            // 佣金
  commissionPaid: boolean;
  contractTerms: ContractTerm[];  // 合同条款
  attachments: Document[];       // 合同附件
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 合同条款
export interface ContractTerm {
  id: string;
  type: 'rent_adjustment' | 'early_termination' | 'maintenance' | 'special';
  content: string;
  isStandard: boolean;
}

// 收款单
export interface PaymentOrder {
  id: string;
  orderNumber: string;
  contractId: string;
  clientId: string;
  clientName: string;
  roomNumber: string;
  amount: number;
  type: 'rent' | 'management_fee' | 'deposit' | 'penalty' | 'utilities' | 'other';
  billingPeriod: string;         // 计费周期
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: 'cash' | 'bank_transfer' | 'alipay' | 'wechat' | 'credit_card';
  reference?: string;            // 支付凭证号
  late_fee?: number;             // 滞纳金
  invoice_issued?: boolean;      // 是否已开发票
  createdBy: string;
  confirmedBy?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 企业服务管理
export interface ClientService {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: 'company_registration' | 'license_application' | 'tax_registration' | 'bank_account' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  serviceProvider?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  cost?: number;
  serviceFee?: number;
  assignedStaff: string;
  progress: number;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// ===================供应商管理===================

export interface Supplier {
  id: string;
  name: string;
  type: 'construction' | 'design' | 'furniture' | 'equipment' | 'service' | 'other';
  category: string;              // 具体分类
  contact: string;
  contactTitle?: string;
  phone: string;
  email?: string;
  address: string;
  businessLicense?: string;
  taxNumber?: string;
  bankAccount?: string;
  bankName?: string;
  rating: 'A' | 'B' | 'C' | 'D';
  cooperationHistory: CooperationRecord[];
  qualifications: Document[];    // 资质证书
  isBlacklisted: boolean;
  blacklistReason?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 合作记录
export interface CooperationRecord {
  id: string;
  projectId: string;
  projectName: string;
  contractAmount: number;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  rating: number;                // 1-5分评价
  feedback?: string;
}

// ===================财务管理===================

// 项目成本支出
export interface ProjectExpense {
  id: string;
  projectId: string;
  projectName: string;
  supplierId?: string;
  supplierName?: string;
  category: 'design' | 'construction' | 'furniture' | 'equipment' | 'service' | 'other';
  amount: number;
  description: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentStatus: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentDate?: string;
  paymentMethod?: string;
  approvedBy?: string;
  paidBy?: string;
  attachments: Document[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// 佣金结算
export interface CommissionSettlement {
  id: string;
  salesPerson: string;
  period: string;               // 结算周期
  contracts: string[];          // 相关合同ID
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  status: 'calculating' | 'pending_approval' | 'approved' | 'paid';
  approvedBy?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 票据管理
export interface Invoice {
  id: string;
  type: 'receipt' | 'vat_invoice' | 'special_invoice';
  number: string;
  clientId: string;
  clientName: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  issueDate: string;
  status: 'draft' | 'issued' | 'sent' | 'received';
  paymentOrderIds: string[];    // 关联的收款单
  issuedBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// ===================KPI和报表===================

export interface KPIData {
  // 资产运营指标
  asset: {
    totalUnits: number;          // 总单元数
    rentedUnits: number;         // 已租单元数
    vacantUnits: number;         // 空置单元数
    renovatingUnits: number;     // 装修中单元数
    occupancyRate: number;       // 出租率
    averageRent: number;         // 平均租金
  };
  
  // 财务指标
  finance: {
    totalRevenue: number;        // 总收入
    totalExpense: number;        // 总支出
    netProfit: number;           // 净利润
    receivableAmount: number;    // 应收金额
    receivedAmount: number;      // 已收金额
    overdueAmount: number;       // 逾期金额
    collectionRate: number;      // 回款率
  };
  
  // 项目指标
  project: {
    inProgressProjects: number;  // 在建项目数
    completedProjects: number;   // 已完成项目数
    delayedProjects: number;     // 延期项目数
    averageProgress: number;     // 平均进度
  };
  
  // 客户指标
  client: {
    totalClients: number;        // 总客户数
    activeClients: number;       // 活跃客户数
    newClientsThisMonth: number; // 本月新增客户
    contractsThisMonth: number;  // 本月签约数
    averageContractValue: number; // 平均合同价值
  };
}

// 待办事项
export interface TodoItem {
  id: string;
  type: 'contract_approval' | 'payment_overdue' | 'contract_expiring' | 'project_delayed' | 'client_follow_up' | 'service_pending';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  relatedId: string;            // 关联的业务ID
  relatedType: string;          // 关联的业务类型
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 快速操作
export interface QuickAction {
  key: string;
  title: string;
  icon: any;
  route: string;
  color: string;
  roles: UserRole[];            // 可见角色
  description?: string;
}

// API响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  total?: number;               // 分页总数
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 筛选参数
export interface FilterParams {
  [key: string]: any;
}

// 潜在项目筛选条件
export interface PotentialProjectFilters {
  name?: string;                         // 项目名称
  projectPhase?: string[];               // 项目阶段
  priority?: string[];                   // 项目优先级
  followUpBy?: string;                   // 跟进人
  nextFollowUpTimeRange?: [string, string]; // 下次跟进时间范围
} 