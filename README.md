# 园区租赁管理系统

一个基于 React + TypeScript + Ant Design 的现代化园区租赁管理系统，提供从签约到收款的全流程管理功能。

## TODO
1. 潜在项目无甲方单位，在签约这个地方要增加甲乙双方信息
2. 一旦潜在项目签约，把该条目相关数据显示在已签约项目数据中
3. 整个签约租金的总额和物业费的总额及总金额的呈现
4. 

## 功能特性

### 🏢 主控台 (Dashboard)
- **关键指标展示**: 园区总览、财务速览、项目速览
- **待办事项提醒**: 待审批合同、逾期款项、待确认付款
- **快速入口**: 发起新签约、登记新项目、查看销控图

### 💰 项目成本管理 (Project Cost)
- **项目列表管理**: 规划中、设计中、施工中、已完工状态
- **供应商管理**: 装修、消防、家具等供应商信息
- **施工进度跟踪**: 甘特图展示施工安装进度
- **成本与付款**: 付款节点设置、付款记录管理

### 👥 客户签约管理 (Client & Contract)
- **客户档案管理**: 企业/个人客户信息维护
- **跟进记录**: 潜在客户跟进流程
- **合同管理**: 商务条款确认、审批流程、合同生成
- **公司注册跟进**: 新公司注册进度跟踪

### 💳 项目收入管理 (Finance & Revenue)
- **财务看板**: 本月应收、实收、逾期金额统计
- **收款管理**: 待收款清单、收款历史、逾期列表
- **票据管理**: 收据/发票开具
- **佣金管理**: 中介佣金计算和支付

### 📊 数据可视化中心 (Reporting)
- **销控图**: 园区平面图可视化展示
- **业务数据大屏**: 收入成本利润趋势分析
- **甘特图中心**: 项目进度汇总展示
- **自定义报表**: 多维度数据筛选导出

## 技术架构

### 前端技术栈
- **React 18**: 现代化的用户界面库
- **TypeScript**: 类型安全的JavaScript超集
- **Ant Design**: 企业级UI组件库
- **React Router**: 单页应用路由管理
- **Recharts**: 数据可视化图表库
- **Axios**: HTTP客户端
- **Zustand**: 轻量级状态管理

### 项目结构
```
src/
├── components/          # 通用组件
├── layouts/            # 布局组件
│   └── MainLayout.tsx  # 主布局
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 主控台
│   ├── ProjectCost.tsx # 项目成本管理
│   ├── ClientContract.tsx # 客户签约管理
│   ├── FinanceRevenue.tsx # 项目收入管理
│   └── Reporting.tsx   # 数据可视化中心
├── types/              # TypeScript类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── api.ts          # API接口
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 主要功能模块

### 1. 主控台 (Dashboard)
- 实时KPI指标展示
- 待办事项提醒
- 快速操作入口
- 财务数据概览

### 2. 项目成本管理
- 项目生命周期管理
- 供应商信息维护
- 施工进度可视化
- 成本控制分析

### 3. 客户签约管理
- 客户信息档案
- 跟进记录管理
- 合同流程管理
- 审批工作流

### 4. 项目收入管理
- 收款计划管理
- 逾期款项处理
- 票据开具管理
- 佣金计算支付

### 5. 数据可视化
- 销控图展示
- 业务数据大屏
- 甘特图进度
- 自定义报表

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件采用函数式编程

### 组件开发
- 组件文件使用 PascalCase 命名
- 每个组件都有对应的 TypeScript 接口
- 使用 React Hooks 管理状态
- 组件职责单一，可复用

### 样式规范
- 使用 Ant Design 设计系统
- 响应式设计，支持多端适配
- 统一的颜色和字体规范
- 组件样式模块化

## 部署说明

### 开发环境
```bash
npm start
```

### 生产环境
```bash
npm run build
npm install -g serve
serve -s build
```

### Docker 部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: support@example.com
- 项目地址: https://github.com/your-username/park-rental-management 