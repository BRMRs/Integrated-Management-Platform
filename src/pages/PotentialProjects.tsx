import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Progress,
  Modal,
  Drawer,
  Tabs,
  Row,
  Col,
  Slider,
  Switch,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Timeline,
  Divider,
  Alert,
  Upload,
  List,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  CheckOutlined,
  CameraOutlined,
  ScanOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  EyeOutlined as PreviewOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  LinkOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DetailedPotentialProject, PotentialProjectFilters, ProjectFollowUpRecord, RentIncrease, FreeRentPeriod, ContractFile, SignedProject, ContractTemplate, AutoFieldMapping, TemplateUploadConfig } from '../types';
import { useAuth, useAppStore } from '../store';
import dayjs from 'dayjs';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const mockData: DetailedPotentialProject[] = [
  {
    id: '1',
    name: '西三环科技园A座',
    projectPhase: '商务条款',
    priority: 'P0',
    nextFollowUpTime: '2024-02-01 10:00',
    followUpBy: '张三',
    notes: '重点关注项目，需要加快推进',
    businessTerms: {
      contact: '王经理',
      contactPhone: '13800138001',
      leaseArea: 5000,
      leaseFloor: '8-10层',
      leasePrice: 4.5,
      leaseTerm: 5,
      paymentMethod: '押2付6',
      startDate: '2024-06-01',
      rentIncreases: [
        { increaseTime: '2025-06-01', increasedPrice: 4.8 },
        { increaseTime: '2027-06-01', increasedPrice: 5.1 }
      ],
      freeRentPeriods: [
        { year: 1, days: 100, startDate: '2024-06-01', endDate: '2024-09-09' },
        { year: 2, days: 90 },
        { year: 3, days: 90 },
        { year: 4, days: 40 }
      ],
      depositItems: ['租金', '物业费'],
      firstPaymentDate: '2024-05-15',
      depositPaymentDate: '2024-05-15',
      propertyFeePrice: 15,
      propertyFeeCalculationMethod: 'independent',
      propertyFeeFreeRentPeriods: [],
      intentionLevel: 85
    },
    followUpRecords: [
      { id: '1', content: '与业主初步接触，表达合作意向', user: '张三', time: '2024-01-15 14:30' },
      { id: '2', content: '实地考察项目，整体条件符合要求', user: '张三', time: '2024-01-20 10:00' }
    ] as ProjectFollowUpRecord[],
    lastFollowUpTime: '2024-01-20 10:00',
    lastFollowUpBy: '张三',
    createdBy: '张三',
    createdAt: '2024-01-10 09:00',
    updatedAt: '2024-01-20 10:00'
  },
  {
    id: '2',
    name: '朝阳大厦B栋',
    projectPhase: '市场调研',
    priority: 'P1',
    nextFollowUpTime: '2024-01-25 14:00',
    followUpBy: '李四',
    marketResearch: {
      operationType: ['代运营'],
      location: '北京市朝阳区建国门外大街',
      propertyOwnerInfo: '朝阳置业集团，民营企业',
      projectProgress: '正在进行前期调研',
      propertyCompany: '绿城物业',
      buildDate: '2020-03-01',
      historicalOperator: '无',
      buildingStandard: '甲级',
      landType: '办公用地',
      decorationStatus: '简装',
      isExclusive: false,
      marketPrice: 6.8,
      occupancyRate: 65,
      commercialFacilities: '周边商圈发达',
      accommodation: '附近有高端住宅区',
      transportation: '地铁1号线、2号线交汇',
      parking: '地面停车场',
      isIncubator: false,
      intentionLevel: 50
    },
    followUpRecords: [
      { id: '1', content: '初步了解项目情况', user: '李四', time: '2024-01-18 16:00' }
    ] as ProjectFollowUpRecord[],
    lastFollowUpTime: '2024-01-18 16:00',
    lastFollowUpBy: '李四',
    createdBy: '李四',
    createdAt: '2024-01-18 09:00',
    updatedAt: '2024-01-18 16:00'
  },
  {
    id: '3',
    name: '海淀科技大厦C座',
    projectPhase: '签订合同',
    priority: 'P0',
    nextFollowUpTime: '2024-02-05 09:00',
    followUpBy: '王五',
    businessTerms: {
      contact: '刘总',
      contactPhone: '13900139001',
      leaseArea: 3000,
      leaseFloor: '5-6层',
      leasePrice: 5.2,
      leaseTerm: 3,
      paymentMethod: '押3付6',
      startDate: '2024-03-01',
      rentIncreases: [],
      freeRentPeriods: [
        { year: 1, days: 60, startDate: '2024-03-01', endDate: '2024-04-29' }
      ],
      depositItems: ['租金', '物业费'],
      firstPaymentDate: '2024-02-15',
      depositPaymentDate: '2024-02-15',
      propertyFeePrice: 18,
      propertyFeeCalculationMethod: 'sync_with_rent',
      propertyFeeFreeRentPeriods: [
        { year: 1, days: 30, startDate: '2024-03-01', endDate: '2024-03-30' }
      ],
      intentionLevel: 100
    },
    contractSigned: {
      partyA: {
        companyName: '北京海淀科技发展有限公司',
        taxNumber: '91110000123456789X',
        companyAddress: '北京市海淀区中关村大街1号',
        legalRepresentative: '张伟'
      },
      partyB: {
        companyName: '创新空间运营管理有限公司',
        taxNumber: '91110000987654321Y',
        companyAddress: '北京市朝阳区建国路88号',
        legalRepresentative: '李明'
      },
      contractFiles: [
        {
          id: '1',
          name: '租赁合同正式版.pdf',
          url: '/contracts/contract_001.pdf',
          uploadTime: '2024-02-01 14:30:00',
          fileSize: 2048576
        }
      ]
    },
    followUpRecords: [
      { id: '1', content: '合同条款最终确认完成', user: '王五', time: '2024-02-01 14:30' },
      { id: '2', content: '甲乙双方信息核实无误', user: '王五', time: '2024-02-02 10:00' }
    ] as ProjectFollowUpRecord[],
    lastFollowUpTime: '2024-02-02 10:00',
    lastFollowUpBy: '王五',
    createdBy: '王五',
    createdAt: '2024-01-25 09:00',
    updatedAt: '2024-02-02 10:00'
  }
];

const PotentialProjects: React.FC = () => {
  const { user } = useAuth();
  const { addSignedProject } = useAppStore();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [followUpForm] = Form.useForm();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DetailedPotentialProject[]>(mockData);
  const [filteredData, setFilteredData] = useState<DetailedPotentialProject[]>(mockData);
  const [filters, setFilters] = useState<PotentialProjectFilters>({});
  
  // 弹窗状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [signContractModalVisible, setSignContractModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DetailedPotentialProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('市场调研');
  
  // 甲方信息识别相关状态
  const [ocrLoading, setOcrLoading] = useState(false);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [companySearchResults, setCompanySearchResults] = useState<any[]>([]);
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  
  // 合同模板相关状态
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [contractPreviewVisible, setContractPreviewVisible] = useState(false);
  const [generatedContractContent, setGeneratedContractContent] = useState<string>('');
  const [generatedContractBuffer, setGeneratedContractBuffer] = useState<ArrayBuffer | null>(null);
  const [templateUploadModalVisible, setTemplateUploadModalVisible] = useState(false);
  const [fieldMappingModalVisible, setFieldMappingModalVisible] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState<any>(null);

  // 项目阶段选项
  const phaseOptions = [
    { label: '市场调研', value: '市场调研', color: '#108ee9' },
    { label: '商务条款', value: '商务条款', color: '#f50' },
    { label: '签订合同', value: '签订合同', color: '#87d068' },
    { label: '已放弃', value: '已放弃', color: '#ccc' }
  ];

  // 优先级选项
  const priorityOptions = [
    { label: 'P0', value: 'P0', color: '#f50' },
    { label: 'P1', value: 'P1', color: '#fa8c16' },
    { label: 'P2', value: 'P2', color: '#52c41a' }
  ];

  // 运营类型选项
  const operationTypeOptions = ['自运营', '代运营', '自购'];

  // 楼宇标准选项
  const buildingStandardOptions = ['甲级', '乙级', '其他'];

  // 装修状态选项
  const decorationStatusOptions = ['毛坯', '简装', '精装', '遗留装修'];

  // 根据阶段渲染不同的表单字段
  const renderPhaseFields = (phase: string) => {
    switch (phase) {
      case '市场调研':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="运营类型"
                  name={['marketResearch', 'operationType']}
                  rules={[{ required: true, message: '请选择运营类型' }]}
                >
                  <Select mode="multiple" placeholder="请选择运营类型">
                    {operationTypeOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所在位置"
                  name={['marketResearch', 'location']}
                  rules={[{ required: true, message: '请输入所在位置' }]}
                >
                  <Input placeholder="请输入详细地址" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="产权方及背景"
              name={['marketResearch', 'propertyOwnerInfo']}
              rules={[{ required: true, message: '请输入产权方及背景' }]}
            >
              <TextArea placeholder="请输入产权方信息及背景" rows={2} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="项目跟进情况"
                  name={['marketResearch', 'projectProgress']}
                >
                  <Input placeholder="请输入项目跟进情况" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="物业公司"
                  name={['marketResearch', 'propertyCompany']}
                >
                  <Input placeholder="请输入物业公司名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="楼宇建设时间"
                  name={['marketResearch', 'buildDate']}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择建设时间" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="历史运营商"
                  name={['marketResearch', 'historicalOperator']}
                >
                  <Input placeholder="请输入历史运营商" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="楼宇标准"
                  name={['marketResearch', 'buildingStandard']}
                >
                  <Select placeholder="请选择楼宇标准">
                    {buildingStandardOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="土地类型"
                  name={['marketResearch', 'landType']}
                >
                  <Input placeholder="请输入土地类型" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="场地装修情况"
                  name={['marketResearch', 'decorationStatus']}
                >
                  <Select placeholder="请选择装修情况">
                    {decorationStatusOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="是否独家"
                  name={['marketResearch', 'isExclusive']}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="市场价"
                  name={['marketResearch', 'marketPrice']}
                >
                  <InputNumber
                    placeholder="市场价"
                    style={{ width: '100%' }}
                    addonAfter="元/㎡/天"
                    min={0}
                    step={0.1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="出租率"
                  name={['marketResearch', 'occupancyRate']}
                >
                  <InputNumber
                    placeholder="出租率"
                    style={{ width: '100%' }}
                    addonAfter="%"
                    min={0}
                    max={100}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="商业配套情况"
                  name={['marketResearch', 'commercialFacilities']}
                >
                  <TextArea placeholder="请输入商业配套情况" rows={2} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="住宿情况"
                  name={['marketResearch', 'accommodation']}
                >
                  <TextArea placeholder="请输入住宿情况" rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="交通情况"
                  name={['marketResearch', 'transportation']}
                >
                  <TextArea placeholder="请输入交通情况" rows={2} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="停车配套"
                  name={['marketResearch', 'parking']}
                >
                  <TextArea placeholder="请输入停车配套情况" rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
            <Form.Item
              label="是否孵化器"
              name={['marketResearch', 'isIncubator']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="合作意向程度"
                  name={['marketResearch', 'intentionLevel']}
                  initialValue={50}
                >
                  <div>
                    <Text strong style={{ color: '#1890ff' }}>50%</Text>
                    <Text style={{ marginLeft: 8, color: '#666' }}>（市场调研阶段自动设置）</Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case '商务条款':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="联系人"
                  name={['businessTerms', 'contact']}
                  rules={[{ required: true, message: '请输入联系人' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="联系电话"
                  name={['businessTerms', 'contactPhone']}
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="租赁面积"
                  name={['businessTerms', 'leaseArea']}
                  rules={[{ required: true, message: '请输入租赁面积' }]}
                >
                  <InputNumber
                    placeholder="租赁面积"
                    style={{ width: '100%' }}
                    addonAfter="㎡"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="租赁楼层"
                  name={['businessTerms', 'leaseFloor']}
                  rules={[{ required: true, message: '请输入租赁楼层' }]}
                >
                  <Input placeholder="如：8-10层" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="租赁单价"
                  name={['businessTerms', 'leasePrice']}
                  rules={[{ required: true, message: '请输入租赁单价' }]}
                >
                  <InputNumber
                    placeholder="租赁单价"
                    style={{ width: '100%' }}
                    addonAfter="元/㎡/天"
                    min={0}
                    step={0.1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="租赁年限"
                  name={['businessTerms', 'leaseTerm']}
                  rules={[{ required: true, message: '请输入租赁年限' }]}
                >
                  <InputNumber
                    placeholder="租赁年限"
                    style={{ width: '100%' }}
                    addonAfter="年"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="付款方式"
                  name={['businessTerms', 'paymentMethod']}
                  rules={[{ required: true, message: '请输入付款方式' }]}
                >
                  <Input placeholder="如：押2付6" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="起租日"
                  name={['businessTerms', 'startDate']}
                  rules={[{ required: true, message: '请选择起租日' }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择起租日" />
                </Form.Item>
              </Col>
            </Row>
            
            {/* 租金递增 */}
            <Divider>租金递增</Divider>
            <Form.List name={['businessTerms', 'rentIncreases']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          label={`递增时间 ${name + 1}`}
                          name={[name, 'increaseTime']}
                          rules={[{ required: true, message: '请选择递增时间' }]}
                        >
                          <DatePicker style={{ width: '100%' }} placeholder="请选择递增时间" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          label="递增后单价"
                          name={[name, 'increasedPrice']}
                          rules={[{ required: true, message: '请输入递增后单价' }]}
                        >
                          <InputNumber
                            placeholder="递增后单价"
                            style={{ width: '100%' }}
                            addonAfter="元/㎡/天"
                            min={0}
                            step={0.1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ textAlign: 'center', paddingTop: 30 }}>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加租金递增
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* 租金免租期 */}
            <Divider>租金免租期</Divider>
            <Form.List name={['businessTerms', 'freeRentPeriods']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    // 使用 shouldUpdate 包裹整行，以便在依赖项变化时重新渲染
                    <Form.Item
                      key={key}
                      shouldUpdate={(prevValues, curValues) => {
                        const prev = prevValues.businessTerms?.freeRentPeriods?.[name];
                        const cur = curValues.businessTerms?.freeRentPeriods?.[name];
                        return (
                        prevValues.businessTerms?.startDate !== curValues.businessTerms?.startDate ||
                          prev?.year !== cur?.year ||
                          prev?.days !== cur?.days ||
                          prev?.startDate !== cur?.startDate
                        );
                      }}
                      noStyle
                    >
                      {({ getFieldValue, setFieldValue }) => {
                        const contractStartDate = getFieldValue(['businessTerms', 'startDate']);
                        const freeRentPeriod = getFieldValue(['businessTerms', 'freeRentPeriods', name]) || {};
                        const { year, days, startDate: customStartDate } = freeRentPeriod;

                        // 调用帮助函数计算日期
                        const dates = calculateFreeRentDates(contractStartDate, year, days, customStartDate);
                        const suggestedStartDate = dates ? dates.startDate : null;
                        const calculatedEndDate = dates ? dates.endDate : null;

                        // 自动更新结束日期到表单中
                        if (calculatedEndDate) {
                          const currentEndDate = getFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate']);
                          if (!currentEndDate || !currentEndDate.isSame(calculatedEndDate, 'day')) {
                            setFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate'], calculatedEndDate);
                          }
                        }

                        return (
                          <div style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: '6px',
                            padding: '16px',
                            marginBottom: '12px',
                            backgroundColor: '#fafafa'
                          }}>
                            <Row gutter={16} align="bottom">
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  label="第几年"
                                  name={[name, 'year']}
                                  rules={[{ required: true, message: '请输入年份' }]}
                                >
                                  <InputNumber 
                                    placeholder="年份" 
                                    style={{ width: '100%' }} 
                                    min={1}
                                                                         onChange={(value) => {
                                       // 当年份改变时，自动设置建议的开始日期
                                       if (value && contractStartDate) {
                                         const newDates = calculateFreeRentDates(contractStartDate, value, days || 0, null);
                                         if (newDates) {
                                           setFieldValue(['businessTerms', 'freeRentPeriods', name, 'startDate'], newDates.startDate);
                                           if (days) {
                                             setFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate'], newDates.endDate);
                                           }
                                         }
                                       }
                                     }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  label="免租天数"
                                  name={[name, 'days']}
                                  rules={[{ required: true, message: '请输入天数' }]}
                                >
                                  <InputNumber 
                                    placeholder="天数" 
                                    style={{ width: '100%' }} 
                                    addonAfter="天" 
                                    min={0}
                                    onChange={(value) => {
                                      // 当天数改变时，自动更新结束日期
                                      if (value && year && contractStartDate) {
                                        const currentStartDate = getFieldValue(['businessTerms', 'freeRentPeriods', name, 'startDate']);
                                        const newDates = calculateFreeRentDates(contractStartDate, year, value, currentStartDate);
                                        if (newDates) {
                                          setFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate'], newDates.endDate);
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  label="开始时间"
                                  name={[name, 'startDate']}
                                  rules={[{ required: true, message: '请选择开始时间' }]}
                                >
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder={suggestedStartDate ? suggestedStartDate.format('YYYY-MM-DD') : '请先填起租日和免租天数'}
                                    format="YYYY-MM-DD"
                                    onChange={(date) => {
                                      // 当开始日期变化时，自动更新结束日期
                                      if (date && days && year && contractStartDate) {
                                      const newDates = calculateFreeRentDates(contractStartDate, year, days, date);
                                      if (newDates) {
                                          setFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate'], newDates.endDate);
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  label="结束时间 (自动计算)"
                                  name={[name, 'endDate']}
                                >
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="自动计算"
                                    format="YYYY-MM-DD"
                                    disabled
                                    value={calculatedEndDate}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                  <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                      if (dates) {
                                        // 自动填充会同时设置开始和结束日期
                                        setFieldValue(['businessTerms', 'freeRentPeriods', name, 'startDate'], dates.startDate);
                                        setFieldValue(['businessTerms', 'freeRentPeriods', name, 'endDate'], dates.endDate);
                                      }
                                    }}
                                    disabled={!dates}
                                    style={{ fontSize: '12px', padding: '0' }}
                                  >
                                    自动填充
                                  </Button>
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              </Col>
                            </Row>
                          </div>
                        );
                      }}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ year: fields.length + 1 })}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加租金免租期
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* 物业费免租期 */}
            <Divider>物业费免租期</Divider>
            <Form.List name={['businessTerms', 'propertyFeeFreeRentPeriods']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    // 使用 shouldUpdate 包裹整行，以便在依赖项变化时重新渲染
                    <Form.Item
                      key={key}
                      shouldUpdate={(prevValues, curValues) => {
                        const prev = prevValues.businessTerms?.propertyFeeFreeRentPeriods?.[name];
                        const cur = curValues.businessTerms?.propertyFeeFreeRentPeriods?.[name];
                        return (
                          prevValues.businessTerms?.startDate !== curValues.businessTerms?.startDate ||
                          prev?.year !== cur?.year ||
                          prev?.days !== cur?.days ||
                          prev?.startDate !== cur?.startDate
                        );
                      }}
                      noStyle
                    >
                      {({ getFieldValue, setFieldValue }) => {
                        const contractStartDate = getFieldValue(['businessTerms', 'startDate']);
                        const propertyFreeRentPeriod = getFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name]) || {};
                        const { year, days, startDate: customStartDate } = propertyFreeRentPeriod;

                        // 调用帮助函数计算日期
                        const dates = calculateFreeRentDates(contractStartDate, year, days, customStartDate);
                        const suggestedStartDate = dates ? dates.startDate : null;
                        const calculatedEndDate = dates ? dates.endDate : null;

                        // 自动更新结束日期到表单中
                        if (calculatedEndDate) {
                          const currentEndDate = getFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate']);
                          if (!currentEndDate || !currentEndDate.isSame(calculatedEndDate, 'day')) {
                            setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate'], calculatedEndDate);
                          }
                        }

                        return (
                          <div style={{
                            border: '1px solid #e6f7ff',
                            borderRadius: '6px',
                            padding: '16px',
                            marginBottom: '12px',
                            backgroundColor: '#f0f9ff'
                          }}>
                            <Row gutter={16} align="bottom">
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  label="第几年"
                                  name={[name, 'year']}
                                  rules={[{ required: true, message: '请输入年份' }]}
                                >
                                  <InputNumber 
                                    placeholder="年份" 
                                    style={{ width: '100%' }} 
                                    min={1}
                                    onChange={(value) => {
                                      // 当年份改变时，自动设置建议的开始日期
                                      if (value && contractStartDate) {
                                        const newDates = calculateFreeRentDates(contractStartDate, value, days || 0, null);
                                        if (newDates) {
                                          setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'startDate'], newDates.startDate);
                                          if (days) {
                                            setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate'], newDates.endDate);
                                          }
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  label="免租天数"
                                  name={[name, 'days']}
                                  rules={[{ required: true, message: '请输入天数' }]}
                                >
                                  <InputNumber 
                                    placeholder="天数" 
                                    style={{ width: '100%' }} 
                                    addonAfter="天" 
                                    min={0}
                                    onChange={(value) => {
                                      // 当天数改变时，自动更新结束日期
                                      if (value && year && contractStartDate) {
                                        const currentStartDate = getFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'startDate']);
                                        const newDates = calculateFreeRentDates(contractStartDate, year, value, currentStartDate);
                                        if (newDates) {
                                          setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate'], newDates.endDate);
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  label="开始时间"
                                  name={[name, 'startDate']}
                                  rules={[{ required: true, message: '请选择开始时间' }]}
                                >
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder={suggestedStartDate ? suggestedStartDate.format('YYYY-MM-DD') : '请先填起租日和免租天数'}
                                    format="YYYY-MM-DD"
                                    onChange={(date) => {
                                      // 当开始日期变化时，自动更新结束日期
                                      if (date && days && year && contractStartDate) {
                                        const newDates = calculateFreeRentDates(contractStartDate, year, days, date);
                                        if (newDates) {
                                          setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate'], newDates.endDate);
                                        }
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  label="结束时间 (自动计算)"
                                  name={[name, 'endDate']}
                                >
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="自动计算"
                                    format="YYYY-MM-DD"
                                    disabled
                                    value={calculatedEndDate}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                  <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                      if (dates) {
                                        // 自动填充会同时设置开始和结束日期
                                        setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'startDate'], dates.startDate);
                                        setFieldValue(['businessTerms', 'propertyFeeFreeRentPeriods', name, 'endDate'], dates.endDate);
                                      }
                                    }}
                                    disabled={!dates}
                                    style={{ fontSize: '12px', padding: '0' }}
                                  >
                                    自动填充
                                  </Button>
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              </Col>
                            </Row>
                          </div>
                        );
                      }}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ year: fields.length + 1 })}
                      block
                      icon={<PlusOutlined />}
                      style={{ borderColor: '#1890ff', color: '#1890ff' }}
                    >
                      添加物业费免租期
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="租赁保证金包含"
                  name={['businessTerms', 'depositItems']}
                >
                  <Select mode="multiple" placeholder="请选择保证金包含项目">
                    <Option value="租金">租金</Option>
                    <Option value="物业费">物业费</Option>
                    <Option value="水电费">水电费</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="物业费单价"
                  name={['businessTerms', 'propertyFeePrice']}
                  rules={[{ required: true, message: '请输入物业费单价' }]}
                >
                  <InputNumber
                    placeholder="物业费单价"
                    style={{ width: '100%' }}
                    addonAfter="元/㎡/月"
                    min={0}
                    step={0.1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="物业费计费方式"
                  name={['businessTerms', 'propertyFeeCalculationMethod']}
                  initialValue="independent"
                  rules={[{ required: true, message: '请选择物业费计费方式' }]}
                >
                  <Select placeholder="请选择计费方式">
                    <Option value="independent">独立计费周期</Option>
                    <Option value="sync_with_rent">与租金同步</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            {/* 物业费计费方式说明 */}
            <Form.Item dependencies={[['businessTerms', 'propertyFeeCalculationMethod']]}>
              {({ getFieldValue }) => {
                const calculationMethod = getFieldValue(['businessTerms', 'propertyFeeCalculationMethod']);
                return (
                  <Alert
                    message={
                      calculationMethod === 'sync_with_rent' 
                        ? '物业费与租金同步：物业费的计费周期与租金保持一致。如果物业费有免租期，按物业费免租期计算；如果没有免租期，从起租日开始，但结束日期与租金首期结束时间一致。'
                        : '独立计费周期：物业费按照合同起租日期独立计算。如果物业费有免租期，从免租期结束次日开始计算；如果没有免租期，从合同起租日开始。'
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                );
              }}
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="首款支付日期"
                  name={['businessTerms', 'firstPaymentDate']}
                  rules={[{ required: true, message: '请选择首款支付日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择首款支付日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="保证金支付日期"
                  name={['businessTerms', 'depositPaymentDate']}
                  rules={[{ required: true, message: '请选择保证金支付日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择保证金支付日期" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="合作意向程度"
              name={['businessTerms', 'intentionLevel']}
              initialValue={80}
            >
              <div>
                <Text strong style={{ color: '#1890ff' }}>80%</Text>
                <Text style={{ marginLeft: 8, color: '#666' }}>（商务条款阶段自动设置）</Text>
              </div>
            </Form.Item>

            {/* 计算结果展示 */}
            <Divider>自动计算结果</Divider>
            <Form.Item dependencies={[
              ['businessTerms', 'leaseArea'],
              ['businessTerms', 'leasePrice'],
              ['businessTerms', 'propertyFeePrice'],
              ['businessTerms', 'paymentMethod'],
              ['businessTerms', 'depositItems'],
              ['businessTerms', 'startDate'],
              ['businessTerms', 'leaseTerm'],
              ['businessTerms', 'freeRentPeriods'],
              ['businessTerms', 'propertyFeeFreeRentPeriods'],
              ['businessTerms', 'rentIncreases'],
              ['businessTerms', 'propertyFeeCalculationMethod']
            ]}>
              {({ getFieldsValue }) => {
                const formData = { businessTerms: getFieldsValue().businessTerms };
                const depositResult = calculateDepositAmount(formData);
                const paymentResult = calculateFirstPayment(formData);
                const totalAmountResult = calculateTotalContractAmount(formData);

                return (
                  <div>
                    {/* 第一行：保证金和首期款 */}
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <Card size="small" title="租赁保证金计算" style={{ backgroundColor: '#f9f9f9' }}>
                        <table style={{ width: '100%', fontSize: '12px' }}>
                          <tbody>
                            <tr>
                              <td>租金保证金：</td>
                              <td style={{ textAlign: 'right' }}>¥{depositResult.rentDeposit.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td>物业费保证金：</td>
                              <td style={{ textAlign: 'right' }}>¥{depositResult.propertyDeposit.toLocaleString()}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #ddd', fontWeight: 'bold' }}>
                              <td>保证金总计：</td>
                              <td style={{ textAlign: 'right' }}>¥{depositResult.totalDeposit.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" title="首期款计算" style={{ backgroundColor: '#f9f9f9' }}>
                        <table style={{ width: '100%', fontSize: '12px' }}>
                          <tbody>
                            <tr>
                              <td>首期租金：</td>
                              <td style={{ textAlign: 'right' }}>¥{paymentResult.rentPayment.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td>首期物业费：</td>
                              <td style={{ textAlign: 'right' }}>¥{paymentResult.propertyPayment.toLocaleString()}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #ddd', fontWeight: 'bold' }}>
                              <td>首期款总计：</td>
                              <td style={{ textAlign: 'right' }}>¥{paymentResult.totalPayment.toLocaleString()}</td>
                            </tr>
                            {paymentResult.rentPaymentStartDate && (
                              <tr>
                                <td colSpan={2} style={{ fontSize: '11px', color: '#666', paddingTop: '8px' }}>
                                  租金：{paymentResult.rentPaymentStartDate} ~ {paymentResult.rentPaymentEndDate}<br/>
                                  物业：{paymentResult.propertyPaymentStartDate} ~ {paymentResult.propertyPaymentEndDate}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Card>
                    </Col>
                  </Row>

                    {/* 第二行：合同总金额 */}
                    {totalAmountResult.grandTotal > 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Card 
                            size="small" 
                            title="合同总金额计算" 
                            style={{ backgroundColor: '#fff7e6', border: '2px solid #ffa940' }}
                          >
                            <Row gutter={16}>
                              <Col span={12}>
                                <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 'bold' }}>签约租金总额：</span>
                                    <span style={{ color: '#1890ff', fontSize: '16px', fontWeight: 'bold' }}>
                                      ¥{totalAmountResult.totalRent.toLocaleString()}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 'bold' }}>物业费总额：</span>
                                    <span style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                                      ¥{totalAmountResult.totalPropertyFee.toLocaleString()}
                                    </span>
                                  </div>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    borderTop: '2px solid #ffa940', 
                                    paddingTop: '8px', 
                                    fontSize: '18px', 
                                    fontWeight: 'bold' 
                                  }}>
                                    <span>合同总金额：</span>
                                    <span style={{ color: '#f5222d' }}>
                                      ¥{totalAmountResult.grandTotal.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>各年度租金明细：</div>
                                  <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                    {totalAmountResult.details.map((detail, index) => (
                                      <div key={index} style={{ marginBottom: '4px', padding: '4px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <span>第{detail.year}年：</span>
                                          <span>¥{detail.yearRent.toLocaleString()}</span>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#999' }}>
                                          单价：¥{detail.rentPrice}/㎡/天 | 收费天数：{detail.chargingDays}天
                                          {detail.freeRentDays > 0 && ` (免租${detail.freeRentDays}天)`}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </>
        );

      case '签订合同':
        return (
          <Form.Item dependencies={[['businessTerms', 'contact'], ['businessTerms', 'contactPhone']]}>
            {({ getFieldValue }) => {
              const businessTermsContact = getFieldValue(['businessTerms', 'contact']);
              const businessTermsContactPhone = getFieldValue(['businessTerms', 'contactPhone']);
              
        return (
          <>
                  {/* 商务条款联系信息展示 */}
                  {(businessTermsContact || businessTermsContactPhone) && (
                    <Card size="small" title="商务条款联系信息" style={{ marginBottom: 16, backgroundColor: '#f0f9ff' }}>
                      <Row gutter={16}>
                        {businessTermsContact && (
                          <Col span={12}>
                            <Text strong>联系人：</Text>
                            <Text>{businessTermsContact}</Text>
                          </Col>
                        )}
                        {businessTermsContactPhone && (
                          <Col span={12}>
                            <Text strong>联系电话：</Text>
                            <Text>{businessTermsContactPhone}</Text>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  )}

                  {/* 甲方信息 */}
                  <Card 
                    size="small" 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>甲方信息</span>
                        <Space>
                          <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(file) => {
                              handleOCRRecognition(file);
                              return false;
                            }}
                          >
                            <Button 
                              size="small" 
                              icon={<CameraOutlined />} 
                              loading={ocrLoading}
                              type="primary"
                              ghost
                            >
                              {ocrLoading ? '识别中...' : '营业执照识别'}
                            </Button>
                          </Upload>
                                                     <Button 
                             size="small" 
                             icon={<DatabaseOutlined />}
                             onClick={() => setShowCompanySearch(!showCompanySearch)}
                             type="primary"
                             ghost
                           >
                             企业信息搜索
                           </Button>
                           {/* 调试按钮 - 生产环境中应移除 */}
                           <Button 
                             size="small" 
                             onClick={() => {
                               const values = editForm.getFieldsValue();
                               console.log('当前表单值:', values);
                               message.info('请查看控制台输出');
                             }}
                             style={{ marginLeft: 8 }}
                           >
                             调试
                           </Button>
                        </Space>
                      </div>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    {/* 企业信息搜索面板 */}
                    {showCompanySearch && (
                      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f0f9ff', borderRadius: 6 }}>
                        <Row gutter={16} align="middle">
                          <Col span={18}>
                                                         <Input
                               placeholder="请输入企业名称、统一社会信用代码或法定代表人进行搜索"
                               prefix={<SearchOutlined />}
                               onChange={(e) => handleCompanySearch(e.target.value)}
                               allowClear
                             />
                          </Col>
                          <Col span={6}>
                            <Button 
                              onClick={() => setShowCompanySearch(false)}
                              size="small"
                            >
                              收起
                            </Button>
                          </Col>
                        </Row>
                        
                        {/* 搜索结果 */}
                        {companySearchResults.length > 0 && (
                          <div style={{ marginTop: 12, maxHeight: 300, overflowY: 'auto' }}>
                            <List
                              size="small"
                              dataSource={companySearchResults}
                              renderItem={(company) => (
                                <List.Item
                                  style={{ 
                                    cursor: 'pointer',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: 4,
                                    marginBottom: 8,
                                    padding: 12,
                                    backgroundColor: '#fff'
                                  }}
                                  onClick={() => handleSelectCompany(company)}
                                >
                                  <List.Item.Meta
                                    title={
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong>{company.companyName}</Text>
                                                                                 <Tag color="green">{company.status}</Tag>
                                      </div>
                                    }
                                    description={
                                      <div style={{ fontSize: 12, color: '#666' }}>
                                        <div>统一社会信用代码：{company.taxNumber}</div>
                                        <div>法定代表人：{company.legalRepresentative}</div>
                                        <div>注册地址：{company.companyAddress}</div>
                                        <div>注册资本：{company.registeredCapital} | 成立日期：{company.establishDate}</div>
                                      </div>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 使用说明 */}
                    <Alert
                      message="智能识别功能说明"
                      description={
                        <div>
                          <p><strong>营业执照识别：</strong>支持上传营业执照图片，自动识别企业信息并填充表单</p>
                          <p><strong>企业信息搜索：</strong>基于国家企业信用信息公示系统，支持企业名称、统一社会信用代码、法定代表人等关键词搜索</p>
                          <p><strong>使用建议：</strong>建议优先使用营业执照识别功能，确保信息准确性</p>
                        </div>
                      }
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                      closable
                    />

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="企业单位"
                          name={['contractSigned', 'partyA', 'companyName']}
                          rules={[{ required: true, message: '请输入甲方企业单位' }]}
                        >
                          <Input 
                            placeholder="请输入甲方企业单位名称" 
                            suffix={
                              <Tooltip title="支持营业执照识别和企业信息搜索">
                                <ScanOutlined style={{ color: '#1890ff' }} />
                              </Tooltip>
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="统一社会信用代码/税号"
                          name={['contractSigned', 'partyA', 'taxNumber']}
                          rules={[{ required: true, message: '请输入甲方税号' }]}
                        >
                          <Input placeholder="请输入统一社会信用代码或税号" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="公司地址"
                          name={['contractSigned', 'partyA', 'companyAddress']}
                          rules={[{ required: true, message: '请输入甲方公司地址' }]}
                        >
                          <Input placeholder="请输入甲方公司地址" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="法定代表人"
                          name={['contractSigned', 'partyA', 'legalRepresentative']}
                          rules={[{ required: true, message: '请输入甲方法定代表人' }]}
                        >
                          <Input placeholder="请输入甲方法定代表人姓名" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* 乙方信息 */}
                  <Card size="small" title="乙方信息" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="企业单位"
                          name={['contractSigned', 'partyB', 'companyName']}
                          rules={[{ required: true, message: '请输入乙方企业单位' }]}
                        >
                          <Input placeholder="请输入乙方企业单位名称" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="统一社会信用代码/税号"
                          name={['contractSigned', 'partyB', 'taxNumber']}
                          rules={[{ required: true, message: '请输入乙方税号' }]}
                        >
                          <Input placeholder="请输入统一社会信用代码或税号" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="公司地址"
                          name={['contractSigned', 'partyB', 'companyAddress']}
                          rules={[{ required: true, message: '请输入乙方公司地址' }]}
                        >
                          <Input placeholder="请输入乙方公司地址" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="法定代表人"
                          name={['contractSigned', 'partyB', 'legalRepresentative']}
                          rules={[{ required: true, message: '请输入乙方法定代表人' }]}
                        >
                          <Input placeholder="请输入乙方法定代表人姓名" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* 合同模板 */}
                  <Card size="small" title="合同模板" style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                      <Col span={16}>
                        <Form.Item
                          label="选择合同模板"
                          name={['contractSigned', 'contractTemplate', 'selectedTemplateId']}
                        >
                          <Select 
                            placeholder="请选择合同模板"
                            onChange={(value) => {
                              const template = contractTemplates.find(t => t.id === value);
                              if (template) {
                                setSelectedTemplate(template);
                              }
                            }}
                            style={{ width: '100%' }}
                            dropdownRender={(menu) => (
                              <div>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ padding: '8px', textAlign: 'center' }}>
                                  <Space>
                                    <Button 
                                      type="link" 
                                      size="small"
                                      icon={<FileTextOutlined />}
                                      onClick={() => setTemplateModalVisible(true)}
                                    >
                                      浏览所有模板
                                    </Button>
                                    <Upload
                                      accept=".html,.docx,.doc"
                                      showUploadList={false}
                                      beforeUpload={handleUploadTemplate}
                                    >
                                      <Button 
                                        type="link" 
                                        size="small"
                                        icon={<CloudUploadOutlined />}
                                      >
                                        上传新模板
                                      </Button>
                                    </Upload>
                                  </Space>
                                </div>
                              </div>
                            )}
                          >
                            {contractTemplates
                              .filter(template => template.isActive)
                              .map(template => (
                                <Option key={template.id} value={template.id}>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '4px 0',
                                    minHeight: '32px'
                                  }}>
                                    <Text strong style={{ marginRight: 8 }}>{template.name}</Text>
                                    {template.isDefault && (
                                      <Tag color="blue" style={{ fontSize: '10px', lineHeight: '16px', margin: '0 2px' }}>
                                        默认
                                      </Tag>
                                    )}
                                    {template.isCustom && (
                                      <Tag color="orange" style={{ fontSize: '10px', lineHeight: '16px', margin: '0 2px' }}>
                                        自定义
                                      </Tag>
                                    )}
                                    <Tag color="green" style={{ fontSize: '10px', lineHeight: '16px', margin: '0 2px' }}>
                                      {template.type}
                                    </Tag>
                                  </div>
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Space>
                          <Button 
                            onClick={() => setTemplateModalVisible(true)}
                            icon={<FileTextOutlined />}
                            size="small"
                          >
                            管理模板
                          </Button>
                          <Upload
                            accept=".html,.docx,.doc"
                            showUploadList={false}
                            beforeUpload={handleUploadTemplate}
                          >
                            <Button 
                              icon={<CloudUploadOutlined />}
                              size="small"
                              type="dashed"
                            >
                              上传模板
                            </Button>
                          </Upload>
                        </Space>
                      </Col>
                    </Row>

                    {selectedTemplate && (
                      <div style={{ 
                        padding: 12, 
                        backgroundColor: '#f6f6f6', 
                        borderRadius: 6, 
                        marginBottom: 16 
                      }}>
                        <Row gutter={16} align="middle">
                          <Col span={16}>
                            <div>
                              <Text strong style={{ color: '#1890ff' }}>
                                已选择：{selectedTemplate.name}
                              </Text>
                                                            {selectedTemplate.isDefault && <Tag color="blue" style={{ marginLeft: 8, fontSize: '11px' }}>默认</Tag>}
                               {selectedTemplate.isCustom && <Tag color="orange" style={{ marginLeft: 8, fontSize: '11px' }}>自定义</Tag>}
                               <Tag color="green" style={{ marginLeft: 4, fontSize: '11px' }}>{selectedTemplate.type}</Tag>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {selectedTemplate.description}
                              </Text>
                            </div>
                          </Col>
                          <Col span={8}>
                            <Space>
                              <Button 
                                type="primary" 
                                size="small"
                                onClick={handleGenerateContractEnhanced}
                                icon={<LinkOutlined />}
                              >
                                智能生成合同
                              </Button>
                              {selectedTemplate.isCustom ? (
                                <>
                                  <Button 
                                    size="small"
                                    icon={<SettingOutlined />}
                                    onClick={() => handleEditTemplate(selectedTemplate)}
                                    title="编辑模板配置"
                                  >
                                    编辑
                                  </Button>
                                  <Button 
                                    size="small" 
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                                    title="删除自定义模板"
                                  >
                                    删除
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  size="small" 
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                                  title="删除系统模板（高风险操作）"
                                >
                                  删除系统模板
                                </Button>
                              )}
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {generatedContractContent && (
                      <div style={{ 
                        padding: 12, 
                        backgroundColor: '#f0f9ff', 
                        borderRadius: 6,
                        border: '1px solid #d6e4ff'
                      }}>
                        <Row gutter={16} align="middle">
                          <Col span={16}>
                            <div>
                              <Text strong style={{ color: '#52c41a' }}>
                                ✓ 合同内容已生成
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                基于 {selectedTemplate?.name} 模板生成，包含项目具体信息
                              </Text>
                            </div>
                          </Col>
                          <Col span={8}>
                            <Space>
                              <Button 
                                size="small"
                                onClick={handlePreviewContract}
                                icon={<PreviewOutlined />}
                              >
                                预览
                              </Button>
                              <Button 
                                size="small"
                                onClick={handleDownloadContract}
                                icon={<DownloadOutlined />}
                                type="primary"
                                ghost
                              >
                                下载
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <Alert
                      message="智能合同模板系统"
                      description={
                        <div>
                          <p><strong>✨ 智能生成：</strong>系统会自动从甲方信息、乙方信息和商务条款中抓取字段，智能填充到合同模板中</p>
                          <p><strong>📤 自定义模板：</strong>支持上传HTML、DOCX格式的自定义合同模板，系统自动识别变量并配置字段映射</p>
                          <p><strong>🔗 字段映射：</strong>每个模板都配置了智能字段映射，确保数据准确填充到对应位置</p>
                          <p><strong>📋 一键生成：</strong>点击"智能生成合同"后，所有可识别的字段将自动填充，无需手动输入</p>
                        </div>
                      }
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                      closable
                    />
                  </Card>

                  {/* 合同文件 */}
                  <Card size="small" title="合同文件">
            <Form.Item
              label="合同文件"
              name={['contractSigned', 'contractFiles']}
              rules={[{ required: true, message: '请上传合同文件' }]}
            >
              <Upload
                action="/api/upload"
                listType="text"
                multiple
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>点击上传合同文件</Button>
              </Upload>
            </Form.Item>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      提示：可以先使用上方的合同模板生成合同文档，然后上传签署后的正式合同文件
                    </Text>
                  </Card>
          </>
              );
            }}
          </Form.Item>
        );

      case '已放弃':
        return (
          <>
            <Form.Item
              label="不再跟进的原因"
              name={['abandoned', 'reason']}
              rules={[{ required: true, message: '请输入不再跟进的原因' }]}
            >
              <TextArea
                placeholder="请详细说明为什么放弃这个项目"
                rows={4}
              />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  // 转换潜在项目为已签约项目
  const convertToSignedProject = (potentialProject: DetailedPotentialProject): SignedProject => {
    const { businessTerms, contractSigned, marketResearch } = potentialProject;
    
    if (!businessTerms || !contractSigned) {
      throw new Error('项目缺少必要的商务条款或合同信息');
    }

    // 生成合同编号
    const contractNumber = `HT-${dayjs().format('YYYYMMDD')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 计算合同总金额
    const totalAmountResult = calculateTotalContractAmount(businessTerms);

    return {
      id: `SP-${Date.now()}`, // 新的签约项目ID
      name: potentialProject.name,
      contractWithLandlord: contractNumber,
      location: marketResearch?.location || '',
      totalArea: businessTerms.leaseArea,
      landlord: businessTerms.contact,
      landlordContact: businessTerms.contactPhone,
      rentToLandlord: totalAmountResult.totalRent, // 签约租金总额
      contractStartDate: businessTerms.startDate,
      contractEndDate: dayjs(businessTerms.startDate).add(businessTerms.leaseTerm, 'year').subtract(1, 'day').format('YYYY-MM-DD'),
      status: 'designing', // 默认状态为设计中
      manager: potentialProject.followUpBy,
      progress: 0, // 初始进度为0
      budget: 0, // 预算待定
      spent: 0, // 已花费为0
      units: [], // 初始化空的单元数组
      
      // 从潜在项目转换来的信息
      potentialProjectId: potentialProject.id,
      leaseFloor: businessTerms.leaseFloor,
      leasePrice: businessTerms.leasePrice,
      leaseTerm: businessTerms.leaseTerm,
      paymentMethod: businessTerms.paymentMethod,
      rentIncreases: businessTerms.rentIncreases,
      freeRentPeriods: businessTerms.freeRentPeriods,
      depositItems: businessTerms.depositItems,
      firstPaymentDate: businessTerms.firstPaymentDate,
      depositPaymentDate: businessTerms.depositPaymentDate,
      propertyFeePrice: businessTerms.propertyFeePrice,
      propertyFeeCalculationMethod: businessTerms.propertyFeeCalculationMethod,
      propertyFeeFreeRentPeriods: businessTerms.propertyFeeFreeRentPeriods,
      
      // 合同双方信息
      partyA: contractSigned.partyA,
      partyB: contractSigned.partyB,
      contractFiles: contractSigned.contractFiles,
      
      // 合同金额信息
      contractAmounts: {
        totalRentAmount: totalAmountResult.totalRent,
        totalPropertyFeeAmount: totalAmountResult.totalPropertyFee,
        totalContractAmount: totalAmountResult.grandTotal,
        yearlyBreakdown: totalAmountResult.details
      },
      
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
  };

  // 处理签约确认
  const handleSignContract = (record: DetailedPotentialProject) => {
    if (record.projectPhase !== '签订合同') {
      message.warning('只有处于"签订合同"阶段的项目才能进行签约确认');
      return;
    }

    if (!record.businessTerms || !record.contractSigned) {
      message.error('项目缺少必要的商务条款或合同信息，无法签约');
      return;
    }

    Modal.confirm({
      title: '确认签约',
      content: (
        <div>
          <p>确定要将项目 <strong>{record.name}</strong> 转入已签约项目管理吗？</p>
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
            <p><strong>项目信息：</strong></p>
            <p>租赁面积：{record.businessTerms.leaseArea} ㎡</p>
            <p>租赁楼层：{record.businessTerms.leaseFloor}</p>
            <p>租赁单价：{record.businessTerms.leasePrice} 元/㎡/天</p>
            <p>租赁期限：{record.businessTerms.leaseTerm} 年</p>
            <p>起租日期：{record.businessTerms.startDate}</p>
          </div>
          <Alert 
            message="签约确认后，该项目将从潜在项目池中移除，并自动创建为已签约项目" 
            type="info" 
            style={{ marginTop: 12 }}
          />
        </div>
      ),
      width: 500,
      onOk: () => {
        try {
          // 转换为已签约项目
          const signedProject = convertToSignedProject(record);
          
          // 添加到已签约项目列表
          addSignedProject(signedProject);
          
          // 从潜在项目列表中移除
          const newDataSource = dataSource.filter(item => item.id !== record.id);
          setDataSource(newDataSource);
          setFilteredData(newDataSource);
          
          message.success(`项目 "${record.name}" 已成功签约，合同编号：${signedProject.contractWithLandlord}`);
        } catch (error) {
          message.error(`签约失败：${error instanceof Error ? error.message : '未知错误'}`);
        }
      },
      okText: '确认签约',
      cancelText: '取消',
      okType: 'primary'
    });
  };

  // 表格列定义
  const columns: ColumnsType<DetailedPotentialProject> = [
    {
      title: '潜在项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (text: string, record: DetailedPotentialProject) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record)}
          style={{ padding: 0, textAlign: 'left' }}
        >
          {text}
        </Button>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: '项目阶段',
      dataIndex: 'projectPhase',
      key: 'projectPhase',
      width: 120,
      render: (phase: string) => {
        const option = phaseOptions.find(opt => opt.value === phase);
        return <Tag color={option?.color}>{phase}</Tag>;
      },
      sorter: (a, b) => a.projectPhase.localeCompare(b.projectPhase)
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const option = priorityOptions.find(opt => opt.value === priority);
        return <Tag color={option?.color}>{priority}</Tag>;
      },
      sorter: (a, b) => a.priority.localeCompare(b.priority)
    },
    {
      title: '下次跟进时间',
      dataIndex: 'nextFollowUpTime',
      key: 'nextFollowUpTime',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.nextFollowUpTime).unix() - dayjs(b.nextFollowUpTime).unix()
    },
    {
      title: '跟进人',
      dataIndex: 'followUpBy',
      key: 'followUpBy',
      width: 100,
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: DetailedPotentialProject) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.projectPhase === '签订合同' && (
            <Tooltip title="确认签约">
              <Button
                type="text"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleSignContract(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个项目吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 搜索筛选
  const handleSearch = (values: any) => {
    setLoading(true);
    const newFilters: PotentialProjectFilters = {
      name: values.name?.trim() || undefined,
      projectPhase: values.projectPhase?.length > 0 ? values.projectPhase : undefined,
      priority: values.priority?.length > 0 ? values.priority : undefined,
      followUpBy: values.followUpBy || undefined,
      nextFollowUpTimeRange: values.nextFollowUpTimeRange || undefined
    };

    setFilters(newFilters);

    // 模拟筛选逻辑
    let filtered = [...dataSource];
    
    if (newFilters.name) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(newFilters.name!.toLowerCase())
      );
    }
    
    if (newFilters.projectPhase?.length) {
      filtered = filtered.filter(item => 
        newFilters.projectPhase!.includes(item.projectPhase)
      );
    }
    
    if (newFilters.priority?.length) {
      filtered = filtered.filter(item => 
        newFilters.priority!.includes(item.priority)
      );
    }
    
    if (newFilters.followUpBy) {
      filtered = filtered.filter(item => 
        item.followUpBy === newFilters.followUpBy
      );
    }

    setTimeout(() => {
      setFilteredData(filtered);
      setLoading(false);
    }, 500);
  };

  // 重置筛选
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setFilteredData(dataSource);
  };

  // 新增项目
  const handleAdd = () => {
    setCurrentRecord(null);
    setIsEditing(false);
    editForm.resetFields();
    setCurrentPhase('市场调研');
    
    // 清理合同模板相关状态
    setSelectedTemplate(null);
    setGeneratedContractContent('');
    
    // 设置默认值
    editForm.setFieldsValue({
      projectPhase: '市场调研',
      priority: 'P1',
      followUpBy: user?.name || '张三',
      nextFollowUpTime: dayjs().add(1, 'day'),
      marketResearch: {
        intentionLevel: 50
      },
      businessTerms: {
        freeRentPeriods: [], // 初始化空的租金免租期数组
        propertyFeeFreeRentPeriods: [] // 初始化空的物业费免租期数组
      }
    });
    setEditModalVisible(true);
  };

  // 编辑项目 - 修复日期处理
  const handleEdit = (record: DetailedPotentialProject) => {
    setCurrentRecord(record);
    setIsEditing(true);
    setCurrentPhase(record.projectPhase);
    
    // 处理不同阶段的日期字段
    let formValues: any = { ...record };
    
    // 处理市场调研阶段的日期字段 - 无论当前阶段是什么，只要有市场调研数据就处理
    if (record.marketResearch) {
      formValues.marketResearch = {
        ...record.marketResearch,
        buildDate: record.marketResearch.buildDate ? dayjs(record.marketResearch.buildDate) : null
      };
    }
    
    // 处理商务条款阶段的日期字段 - 无论当前阶段是什么，只要有商务条款数据就处理
    if (record.businessTerms) {
        formValues.businessTerms = {
          ...record.businessTerms,
          startDate: record.businessTerms.startDate ? dayjs(record.businessTerms.startDate) : null,
          firstPaymentDate: record.businessTerms.firstPaymentDate ? dayjs(record.businessTerms.firstPaymentDate) : null,
          depositPaymentDate: record.businessTerms.depositPaymentDate ? dayjs(record.businessTerms.depositPaymentDate) : null,
          propertyFeeCalculationMethod: record.businessTerms.propertyFeeCalculationMethod || 'independent', // 设置默认值
          rentIncreases: record.businessTerms.rentIncreases?.map(increase => ({
            ...increase,
            increaseTime: dayjs(increase.increaseTime)
          })) || [],
          freeRentPeriods: record.businessTerms.freeRentPeriods?.map(period => ({
            ...period,
            startDate: period.startDate ? dayjs(period.startDate) : null,
            // 确保 endDate 也被转换为 dayjs 对象
            endDate: period.endDate ? dayjs(period.endDate) : null
          })) || [],
          propertyFeeFreeRentPeriods: record.businessTerms.propertyFeeFreeRentPeriods?.map(period => ({
            ...period,
            startDate: period.startDate ? dayjs(period.startDate) : null,
            endDate: period.endDate ? dayjs(period.endDate) : null
          })) || []
        };
      }
    
    if (record.nextFollowUpTime) {
      formValues.nextFollowUpTime = dayjs(record.nextFollowUpTime);
    }
    
    // 处理合同模板相关数据
    if (record.contractSigned?.contractTemplate) {
      const templateId = record.contractSigned.contractTemplate.selectedTemplateId;
      if (templateId) {
        const template = contractTemplates.find(t => t.id === templateId);
        if (template) {
          setSelectedTemplate(template);
        }
      }
      if (record.contractSigned.contractTemplate.generatedContent) {
        setGeneratedContractContent(record.contractSigned.contractTemplate.generatedContent);
      }
    }
    
    editForm.setFieldsValue(formValues);
    setEditModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record: DetailedPotentialProject) => {
    setCurrentRecord(record);
    setDetailDrawerVisible(true);
  };

  // 删除项目
  const handleDelete = (id: string) => {
    const newData = dataSource.filter(item => item.id !== id);
    setDataSource(newData);
    setFilteredData(newData.filter(item => {
      // 应用当前筛选条件
      return true; // 简化处理
    }));
    message.success('删除成功');
  };

  // 保存项目
  const handleSave = async (values: any) => {
    try {
      const now = new Date().toISOString();
      
      // 处理日期字段
      const processedValues = { ...values };
      
      // 自动设置合作意向程度
      const intentionLevel = getIntentionLevelByPhase(processedValues.projectPhase);
      
      // 根据不同阶段设置合作意向程度
      if (processedValues.marketResearch) {
        processedValues.marketResearch.intentionLevel = intentionLevel;
      }
      if (processedValues.businessTerms) {
        processedValues.businessTerms.intentionLevel = intentionLevel;
      }
      if (processedValues.contractSigned) {
        processedValues.contractSigned.intentionLevel = intentionLevel;
      }
      if (processedValues.abandoned) {
        processedValues.abandoned.intentionLevel = intentionLevel;
      }
      
      // 处理市场调研阶段的日期
      if (processedValues.marketResearch?.buildDate) {
        processedValues.marketResearch.buildDate = processedValues.marketResearch.buildDate.format('YYYY-MM-DD');
      }
      
      // 处理商务条款阶段的日期
      if (processedValues.businessTerms) {
        if (processedValues.businessTerms.startDate) {
          processedValues.businessTerms.startDate = processedValues.businessTerms.startDate.format('YYYY-MM-DD');
        }
        if (processedValues.businessTerms.firstPaymentDate) {
          processedValues.businessTerms.firstPaymentDate = processedValues.businessTerms.firstPaymentDate.format('YYYY-MM-DD');
        }
        if (processedValues.businessTerms.depositPaymentDate) {
          processedValues.businessTerms.depositPaymentDate = processedValues.businessTerms.depositPaymentDate.format('YYYY-MM-DD');
        }
        
        // 处理租金递增日期
        if (processedValues.businessTerms.rentIncreases) {
          processedValues.businessTerms.rentIncreases = processedValues.businessTerms.rentIncreases.map((increase: any) => ({
            ...increase,
            increaseTime: increase.increaseTime.format('YYYY-MM-DD')
          }));
        }
        
        // 处理租金免租期日期
        if (processedValues.businessTerms.freeRentPeriods) {
            processedValues.businessTerms.freeRentPeriods = processedValues.businessTerms.freeRentPeriods.map((period: any) => ({
              ...period,
              startDate: period.startDate ? period.startDate.format('YYYY-MM-DD') : null,
              // 确保 endDate 也被格式化
              endDate: period.endDate ? (period.endDate.format ? period.endDate.format('YYYY-MM-DD') : period.endDate) : null
            }));
          }
        
        // 处理物业费免租期日期
        if (processedValues.businessTerms.propertyFeeFreeRentPeriods) {
            processedValues.businessTerms.propertyFeeFreeRentPeriods = processedValues.businessTerms.propertyFeeFreeRentPeriods.map((period: any) => ({
              ...period,
              startDate: period.startDate ? period.startDate.format('YYYY-MM-DD') : null,
              endDate: period.endDate ? (period.endDate.format ? period.endDate.format('YYYY-MM-DD') : period.endDate) : null
            }));
          }
  
      }
      
      if (processedValues.nextFollowUpTime) {
        processedValues.nextFollowUpTime = processedValues.nextFollowUpTime.format('YYYY-MM-DD HH:mm:ss');
      }

      let newRecord: DetailedPotentialProject;
      
      if (isEditing) {
        // 编辑模式：保留原有记录的所有数据，只更新表单中的字段
        newRecord = {
          ...currentRecord!,  // 先保留原有的所有数据
          // 更新基础字段
          name: processedValues.name,
          projectPhase: processedValues.projectPhase,
          priority: processedValues.priority,
          nextFollowUpTime: processedValues.nextFollowUpTime || now,
          followUpBy: processedValues.followUpBy || user?.name || '',
          notes: processedValues.notes,
          // 根据当前阶段更新对应的阶段数据
          ...(processedValues.marketResearch && { marketResearch: processedValues.marketResearch }),
          ...(processedValues.businessTerms && { businessTerms: processedValues.businessTerms }),
          ...(processedValues.contractSigned && { contractSigned: processedValues.contractSigned }),
          ...(processedValues.abandoned && { abandoned: processedValues.abandoned }),
          // 更新时间戳
          lastFollowUpTime: processedValues.nextFollowUpTime || now,
          lastFollowUpBy: processedValues.followUpBy || user?.name || '',
          updatedAt: now
        };
      } else {
        // 新增模式：直接使用处理后的数据
        newRecord = {
          id: `${Date.now()}`,
        ...processedValues,
          followUpRecords: [],
        lastFollowUpTime: processedValues.nextFollowUpTime || now,
        lastFollowUpBy: processedValues.followUpBy || user?.name || '',
          createdBy: user?.name || '',
          createdAt: now,
        updatedAt: now
      };
      }

      let newData;
      if (isEditing) {
        newData = dataSource.map(item => 
          item.id === currentRecord!.id ? newRecord : item
        );
      } else {
        newData = [newRecord, ...dataSource];
      }

      setDataSource(newData);
      setFilteredData(newData);
      setEditModalVisible(false);
      editForm.resetFields();
      setCurrentPhase('市场调研');
      message.success(isEditing ? '更新成功' : '添加成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 添加跟进记录
  const handleAddFollowUp = async (values: any) => {
    if (!currentRecord) return;

    const newFollowUp: ProjectFollowUpRecord = {
      id: `${Date.now()}`,
      content: values.content,
      user: user?.name || '',
      time: new Date().toISOString().replace('T', ' ').split('.')[0]
    };

    const updatedRecord = {
      ...currentRecord,
      followUpRecords: [newFollowUp, ...currentRecord.followUpRecords],
      lastFollowUpTime: newFollowUp.time,
      lastFollowUpBy: newFollowUp.user,
      updatedAt: newFollowUp.time
    };

    const newData = dataSource.map(item => 
      item.id === currentRecord.id ? updatedRecord : item
    );

    setDataSource(newData);
    setFilteredData(newData);
    setCurrentRecord(updatedRecord);
    followUpForm.resetFields();
    message.success('跟进记录添加成功');
  };

  // 导出Excel
  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // 获取用户列表（用于筛选）
  const getUserOptions = () => {
    const users = Array.from(new Set(dataSource.map(item => item.followUpBy)));
    // 添加当前用户
    if (user?.name && !users.includes(user.name)) {
      users.push(user.name);
    }
    // 添加一些常见用户
    const commonUsers = ['张三', '李四', '王五', '赵六'];
    commonUsers.forEach(name => {
      if (!users.includes(name)) {
        users.push(name);
      }
    });
    return users.map(user => ({ label: user, value: user }));
  };

  // 监听表单阶段变化
  useEffect(() => {
    const subscription = editForm.getFieldsValue();
    if (subscription.projectPhase && subscription.projectPhase !== currentPhase) {
      setCurrentPhase(subscription.projectPhase);
    }
  }, [editForm]);

  // 初始化合同模板数据
  useEffect(() => {
    // 模拟加载合同模板数据
    const mockTemplates: ContractTemplate[] = [
      {
        id: '1',
        name: '标准租赁合同模板',
        description: '适用于一般商业场地租赁的标准合同模板',
        type: 'lease',
        content: `
          <h2 style="text-align: center;">场地租赁合同</h2>
          <p><strong>甲方（出租方）：</strong>{{partyA.companyName}}</p>
          <p><strong>统一社会信用代码：</strong>{{partyA.taxNumber}}</p>
          <p><strong>地址：</strong>{{partyA.companyAddress}}</p>
          <p><strong>法定代表人：</strong>{{partyA.legalRepresentative}}</p>
          <br/>
          <p><strong>乙方（承租方）：</strong>{{partyB.companyName}}</p>
          <p><strong>统一社会信用代码：</strong>{{partyB.taxNumber}}</p>
          <p><strong>地址：</strong>{{partyB.companyAddress}}</p>
          <p><strong>法定代表人：</strong>{{partyB.legalRepresentative}}</p>
          <br/>
          <p>经甲乙双方友好协商，就乙方租赁甲方场地事宜，达成如下协议：</p>
          <h3>第一条 租赁场地</h3>
          <p>甲方同意将位于<strong>{{projectLocation}}</strong>的场地出租给乙方使用。</p>
          <p>租赁面积：<strong>{{leaseArea}}</strong>平方米</p>
          <p>租赁楼层：<strong>{{leaseFloor}}</strong></p>
          <h3>第二条 租赁期限</h3>
          <p>租赁期限为<strong>{{leaseTerm}}</strong>年，自<strong>{{startDate}}</strong>起至<strong>{{endDate}}</strong>止。</p>
          <h3>第三条 租金及支付方式</h3>
          <p>租金单价：每平方米每天人民币<strong>{{leasePrice}}</strong>元</p>
          <p>月租金总额：人民币<strong>{{monthlyRent}}</strong>元</p>
          <p>支付方式：<strong>{{paymentMethod}}</strong></p>
          <p>物业费单价：每平方米每月人民币<strong>{{propertyFeePrice}}</strong>元</p>
          {{#if freeRentPeriods}}
          <h3>第四条 免租期</h3>
          <p>甲方同意给予乙方以下免租期：</p>
          <ul>
          {{#each freeRentPeriods}}
          <li>第{{year}}年：免租{{days}}天</li>
          {{/each}}
          </ul>
          {{/if}}
          <h3>第五条 保证金</h3>
          <p>乙方应在签订本合同时向甲方支付保证金人民币<strong>{{depositAmount}}</strong>元。</p>
          <h3>第六条 其他条款</h3>
          <p>1. 乙方应按时支付租金及相关费用；</p>
          <p>2. 乙方不得擅自转租、分租或改变房屋用途；</p>
          <p>3. 合同期满，乙方应按时交还场地；</p>
          <p>4. 本合同自双方签字盖章之日起生效。</p>
          <br/>
          <table style="width: 100%; margin-top: 50px;">
            <tr>
              <td style="width: 50%; text-align: center;">
                <p><strong>甲方（盖章）：</strong></p>
                <br/><br/>
                <p>代表人：_______________</p>
                <p>日期：_______________</p>
              </td>
              <td style="width: 50%; text-align: center;">
                <p><strong>乙方（盖章）：</strong></p>
                <br/><br/>
                <p>代表人：_______________</p>
                <p>日期：_______________</p>
              </td>
            </tr>
          </table>
        `,
        variables: [
          { key: 'projectLocation', label: '项目位置', type: 'text', required: true, autoExtract: true, sourceField: 'marketResearch.location' },
          { key: 'leaseArea', label: '租赁面积', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.leaseArea' },
          { key: 'leaseFloor', label: '租赁楼层', type: 'text', required: true, autoExtract: true, sourceField: 'businessTerms.leaseFloor' },
          { key: 'leaseTerm', label: '租赁年限', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.leaseTerm' },
          { key: 'startDate', label: '起租日期', type: 'date', required: true, autoExtract: true, sourceField: 'businessTerms.startDate' },
          { key: 'endDate', label: '结束日期', type: 'date', required: true, autoExtract: true, sourceField: 'calculated' },
          { key: 'leasePrice', label: '租金单价', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.leasePrice' },
          { key: 'monthlyRent', label: '月租金', type: 'number', required: true, autoExtract: true, sourceField: 'calculated' },
          { key: 'paymentMethod', label: '付款方式', type: 'text', required: true, autoExtract: true, sourceField: 'businessTerms.paymentMethod' },
          { key: 'propertyFeePrice', label: '物业费单价', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.propertyFeePrice' },
          { key: 'depositAmount', label: '保证金金额', type: 'number', required: true, autoExtract: true, sourceField: 'calculated' }
        ],
        isDefault: true,
        isActive: true,
        isCustom: false,
        fileFormat: 'html',
        autoMapping: {
          partyA: {
            companyName: 'partyA.companyName',
            taxNumber: 'partyA.taxNumber',
            companyAddress: 'partyA.companyAddress',
            legalRepresentative: 'partyA.legalRepresentative'
          },
          partyB: {
            companyName: 'partyB.companyName',
            taxNumber: 'partyB.taxNumber',
            companyAddress: 'partyB.companyAddress',
            legalRepresentative: 'partyB.legalRepresentative'
          },
          project: {
            name: 'projectName',
            location: 'projectLocation'
          },
          businessTerms: {
            leaseArea: 'leaseArea',
            leaseFloor: 'leaseFloor',
            leasePrice: 'leasePrice',
            leaseTerm: 'leaseTerm',
            startDate: 'startDate',
            endDate: 'endDate',
            paymentMethod: 'paymentMethod',
            propertyFeePrice: 'propertyFeePrice',
            freeRentPeriods: 'freeRentPeriods',
            depositAmount: 'depositAmount',
            monthlyRent: 'monthlyRent'
          }
        },
        createdBy: '系统',
        createdAt: '2024-01-01 00:00:00',
        updatedAt: '2024-01-01 00:00:00',
        version: '1.0'
      },
      {
        id: '2',
        name: '共享办公租赁合同',
        description: '适用于共享办公、联合办公等灵活办公场所的租赁合同',
        type: 'lease',
        content: `
          <h2 style="text-align: center;">共享办公场地租赁合同</h2>
          <p>本合同适用于灵活办公、共享办公场所的租赁。</p>
          <p><strong>甲方：</strong>{{partyA.companyName}}</p>
          <p><strong>乙方：</strong>{{partyB.companyName}}</p>
          <p>租赁面积：{{leaseArea}}平方米</p>
          <p>租赁期限：{{leaseTerm}}年</p>
          <p>特殊条款：提供共享会议室、茶水间等公共设施使用权。</p>
        `,
        variables: [
          { key: 'leaseArea', label: '租赁面积', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.leaseArea' },
          { key: 'leaseTerm', label: '租赁年限', type: 'number', required: true, autoExtract: true, sourceField: 'businessTerms.leaseTerm' }
        ],
        isDefault: false,
        isActive: true,
        isCustom: false,
        fileFormat: 'html',
        autoMapping: {
          partyA: { companyName: 'partyA.companyName', taxNumber: '', companyAddress: '', legalRepresentative: '' },
          partyB: { companyName: 'partyB.companyName', taxNumber: '', companyAddress: '', legalRepresentative: '' },
          project: { name: '', location: '' },
          businessTerms: { leaseArea: 'leaseArea', leaseFloor: '', leasePrice: '', leaseTerm: 'leaseTerm', startDate: '', endDate: '', paymentMethod: '', propertyFeePrice: '', freeRentPeriods: '', depositAmount: '', monthlyRent: '' }
        },
        createdBy: '张三',
        createdAt: '2024-01-15 10:00:00',
        updatedAt: '2024-01-15 10:00:00',
        version: '1.0'
      },
      {
        id: '3',
        name: '孵化器入驻合同',
        description: '适用于科技孵化器、创业园区的入驻合同',
        type: 'service',
        content: `
          <h2 style="text-align: center;">孵化器入驻服务合同</h2>
          <p>本合同除场地租赁外，还包含创业孵化服务。</p>
          <p><strong>甲方：</strong>{{partyA.companyName}}</p>
          <p><strong>乙方：</strong>{{partyB.companyName}}</p>
          <p>服务内容：场地租赁 + 创业指导 + 资源对接</p>
        `,
        variables: [
          { key: 'serviceType', label: '服务类型', type: 'select', required: true, options: ['基础孵化', '深度孵化', '加速器'], autoExtract: false }
        ],
        isDefault: false,
        isActive: true,
        isCustom: false,
        fileFormat: 'html',
        autoMapping: {
          partyA: { companyName: 'partyA.companyName', taxNumber: '', companyAddress: '', legalRepresentative: '' },
          partyB: { companyName: 'partyB.companyName', taxNumber: '', companyAddress: '', legalRepresentative: '' },
          project: { name: '', location: '' },
          businessTerms: { leaseArea: '', leaseFloor: '', leasePrice: '', leaseTerm: '', startDate: '', endDate: '', paymentMethod: '', propertyFeePrice: '', freeRentPeriods: '', depositAmount: '', monthlyRent: '' }
        },
        createdBy: '李四',
        createdAt: '2024-01-20 14:00:00',
        updatedAt: '2024-01-20 14:00:00',
        version: '1.0'
      }
    ];
    setContractTemplates(mockTemplates);
  }, []);

  // 自动设置合作意向程度
  const getIntentionLevelByPhase = (phase: string): number => {
    switch (phase) {
      case '市场调研': return 50;
      case '商务条款': return 80;
      case '签订合同': return 100;
      case '已放弃': return 0;
      default: return 50;
    }
  };

  // OCR识别营业执照
  const handleOCRRecognition = async (file: File) => {
    setOcrLoading(true);
    try {
      // 模拟OCR识别API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟识别结果
      const mockOCRResult = {
        companyName: '北京海淀科技发展有限公司',
        taxNumber: '91110000123456789X',
        companyAddress: '北京市海淀区中关村大街1号',
        legalRepresentative: '张伟',
        registeredCapital: '1000万元',
        establishDate: '2020-01-01',
        businessScope: '技术开发、技术服务、技术咨询'
      };

      console.log('OCR识别前的表单值:', editForm.getFieldsValue());
      
      // 直接设置具体的表单字段，而不是整个对象
      editForm.setFieldValue(['contractSigned', 'partyA', 'companyName'], mockOCRResult.companyName);
      editForm.setFieldValue(['contractSigned', 'partyA', 'taxNumber'], mockOCRResult.taxNumber);
      editForm.setFieldValue(['contractSigned', 'partyA', 'companyAddress'], mockOCRResult.companyAddress);
      editForm.setFieldValue(['contractSigned', 'partyA', 'legalRepresentative'], mockOCRResult.legalRepresentative);
      
      // 验证数据是否正确设置
      setTimeout(() => {
        const finalValues = editForm.getFieldsValue();
        console.log('OCR识别后的表单值:', finalValues.contractSigned?.partyA);
        console.log('完整的表单值:', finalValues);
      }, 100);
      
      message.success('营业执照识别成功，信息已自动填充');
    } catch (error) {
      console.error('OCR识别错误:', error);
      message.error('OCR识别失败，请重试');
    } finally {
      setOcrLoading(false);
    }
  };

  // 企业信息搜索
  const handleCompanySearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setCompanySearchResults([]);
      setShowCompanySearch(false);
      return;
    }

    setCompanySearchLoading(true);
    try {
      // 模拟企业信息搜索API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟搜索结果
      const mockSearchResults = [
        {
          id: '1',
          companyName: '北京海淀科技发展有限公司',
          taxNumber: '91110000123456789X',
          companyAddress: '北京市海淀区中关村大街1号',
          legalRepresentative: '张伟',
          registeredCapital: '1000万元',
          establishDate: '2020-01-01',
          businessScope: '技术开发、技术服务、技术咨询',
          status: '存续'
        },
        {
          id: '2',
          companyName: '北京海淀科技创新有限公司',
          taxNumber: '91110000987654321Y',
          companyAddress: '北京市海淀区中关村大街2号',
          legalRepresentative: '李明',
          registeredCapital: '2000万元',
          establishDate: '2019-06-15',
          businessScope: '软件开发、技术转让、技术推广',
          status: '存续'
        },
        {
          id: '3',
          companyName: '海淀科技园发展有限公司',
          taxNumber: '91110000456789123Z',
          companyAddress: '北京市海淀区中关村大街3号',
          legalRepresentative: '王强',
          registeredCapital: '5000万元',
          establishDate: '2018-03-20',
          businessScope: '园区管理、物业服务、企业管理咨询',
          status: '存续'
        }
      ].filter(company => 
        company.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
        company.taxNumber.includes(keyword) ||
        company.legalRepresentative.includes(keyword)
      );

      setCompanySearchResults(mockSearchResults);
      setShowCompanySearch(mockSearchResults.length > 0);
    } catch (error) {
      message.error('企业信息搜索失败，请重试');
    } finally {
      setCompanySearchLoading(false);
    }
  };

  // 选择企业信息
  const handleSelectCompany = (company: any) => {
    try {
      console.log('企业搜索前的表单值:', editForm.getFieldsValue());
      
      // 直接设置具体的表单字段，而不是整个对象
      editForm.setFieldValue(['contractSigned', 'partyA', 'companyName'], company.companyName);
      editForm.setFieldValue(['contractSigned', 'partyA', 'taxNumber'], company.taxNumber);
      editForm.setFieldValue(['contractSigned', 'partyA', 'companyAddress'], company.companyAddress);
      editForm.setFieldValue(['contractSigned', 'partyA', 'legalRepresentative'], company.legalRepresentative);
      
      // 验证数据是否正确设置
      setTimeout(() => {
        const finalValues = editForm.getFieldsValue();
        console.log('企业搜索后的表单值:', finalValues.contractSigned?.partyA);
      }, 100);
      
      setShowCompanySearch(false);
      setCompanySearchResults([]);
      message.success('企业信息已填充');
    } catch (error) {
      console.error('填充企业信息错误:', error);
      message.error('企业信息填充失败，请重试');
    }
  };

  // 选择合同模板
  const handleSelectTemplate = (template: ContractTemplate) => {
    try {
      setSelectedTemplate(template);
      editForm.setFieldValue(['contractSigned', 'contractTemplate', 'selectedTemplateId'], template.id);
      setTemplateModalVisible(false);
      
      // 检查模板是否有字段映射配置
      if (!template.autoMapping) {
        message.warning(`已选择模板：${template.name}，但该模板尚未配置字段映射，建议先配置后再生成合同`);
      } else {
        message.success(`已选择模板：${template.name}`);
      }
    } catch (error) {
      console.error('选择模板时出错:', error);
      message.error('选择模板失败，请重试');
    }
  };

  // 生成合同内容
  const handleGenerateContract = () => {
    if (!selectedTemplate) {
      message.warning('请先选择合同模板');
      return;
    }

    const formValues = editForm.getFieldsValue();
    const { businessTerms, contractSigned, marketResearch } = formValues;

    // 构建模板变量数据
    const templateData = {
      // 甲乙双方信息
      partyA: contractSigned?.partyA || {},
      partyB: contractSigned?.partyB || {},
      
      // 项目基本信息
      projectLocation: marketResearch?.location || '',
      projectName: formValues.name || '',
      
      // 租赁信息
      leaseArea: businessTerms?.leaseArea || 0,
      leaseFloor: businessTerms?.leaseFloor || '',
      leaseTerm: businessTerms?.leaseTerm || 0,
      leasePrice: businessTerms?.leasePrice || 0,
      paymentMethod: businessTerms?.paymentMethod || '',
      propertyFeePrice: businessTerms?.propertyFeePrice || 0,
      
      // 日期信息
      startDate: businessTerms?.startDate || '',
      endDate: businessTerms?.startDate ? 
        dayjs(businessTerms.startDate).add(businessTerms?.leaseTerm || 0, 'year').subtract(1, 'day').format('YYYY-MM-DD') : '',
      
      // 计算字段
      monthlyRent: businessTerms?.leaseArea && businessTerms?.leasePrice ? 
        Math.round(businessTerms.leaseArea * businessTerms.leasePrice * 30.44) : 0, // 平均每月天数
      
      // 免租期信息
      freeRentPeriods: businessTerms?.freeRentPeriods || [],
      
      // 保证金信息
      depositAmount: (() => {
        const depositResult = calculateDepositAmount({ businessTerms });
        return depositResult.totalDeposit;
      })()
    };

    // 简单的模板变量替换（实际项目中应使用专业的模板引擎如 Handlebars）
    let generatedContent = selectedTemplate.content;
    
    // 替换简单变量
    Object.entries(templateData).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const regex = new RegExp(`{{${key}}}`, 'g');
        generatedContent = generatedContent.replace(regex, String(value));
      }
    });

    // 替换嵌套对象变量
    Object.entries(templateData.partyA).forEach(([key, value]) => {
      const regex = new RegExp(`{{partyA\\.${key}}}`, 'g');
      generatedContent = generatedContent.replace(regex, String(value || ''));
    });

    Object.entries(templateData.partyB).forEach(([key, value]) => {
      const regex = new RegExp(`{{partyB\\.${key}}}`, 'g');
      generatedContent = generatedContent.replace(regex, String(value || ''));
    });

    // 处理免租期列表（简化处理）
    if (templateData.freeRentPeriods.length > 0) {
      const freeRentHtml = templateData.freeRentPeriods
        .map((period: any) => `<li>第${period.year}年：免租${period.days}天</li>`)
        .join('');
      generatedContent = generatedContent.replace(/{{#if freeRentPeriods}}[\s\S]*?{{\/if}}/g, 
        `<h3>第四条 免租期</h3><p>甲方同意给予乙方以下免租期：</p><ul>${freeRentHtml}</ul>`);
    } else {
      generatedContent = generatedContent.replace(/{{#if freeRentPeriods}}[\s\S]*?{{\/if}}/g, '');
    }

    // 清理未替换的变量
    generatedContent = generatedContent.replace(/{{[^}]*}}/g, '___________');

    setGeneratedContractContent(generatedContent);
    editForm.setFieldValue(['contractSigned', 'contractTemplate', 'generatedContent'], generatedContent);
    editForm.setFieldValue(['contractSigned', 'contractTemplate', 'templateVariables'], templateData);
    
    message.success('合同内容生成成功');
  };

  // 预览合同
  const handlePreviewContract = () => {
    if (!generatedContractContent) {
      message.warning('请先生成合同内容');
      return;
    }
    setContractPreviewVisible(true);
  };

  // 下载合同
  const handleDownloadContract = async () => {
    if (!generatedContractContent) {
      message.warning('请先生成合同内容');
      return;
    }

    try {
      const projectName = editForm.getFieldValue('name') || '未知项目';
      const templateName = selectedTemplate?.name || '未知模板';
      const fileName = `合同-${projectName}-${templateName}-${dayjs().format('YYYY-MM-DD')}`;

      // 判断原模板格式决定下载格式
      if (selectedTemplate?.fileFormat === 'docx' || selectedTemplate?.originalFileName?.endsWith('.docx')) {
        // 如果有生成的DOCX缓冲区，直接下载；否则转换HTML为DOCX
        if (generatedContractBuffer) {
          downloadGeneratedDocx(generatedContractBuffer, fileName);
        } else {
          await downloadAsDocx(generatedContractContent, fileName);
        }
      } else {
        // 下载为HTML格式
        downloadAsHtml(generatedContractContent, fileName);
      }
      
      message.success('合同文件下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      message.error('合同文件下载失败，请重试');
    }
  };

  // 下载为HTML格式
  const downloadAsHtml = (content: string, fileName: string) => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body { font-family: 'Microsoft YaHei', '宋体', Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .signature-area { margin-top: 50px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${fileName}.html`);
  };

  // 下载生成的DOCX文件
  const downloadGeneratedDocx = (buffer: ArrayBuffer, fileName: string) => {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    saveAs(blob, `${fileName}.docx`);
  };

  // 下载为DOCX格式
  const downloadAsDocx = async (htmlContent: string, fileName: string) => {
    try {
      // 简单的HTML到文本转换（移除HTML标签）
      const textContent = htmlContent
        .replace(/<h[1-6][^>]*>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<p[^>]*>/gi, '\n')
        .replace(/<\/p>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<strong[^>]*>|<\/strong>/gi, '')
        .replace(/<b[^>]*>|<\/b>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      // 创建DOCX文档
      const doc = new Document({
        sections: [{
          properties: {},
          children: textContent.split('\n\n').map(paragraph => 
            new Paragraph({
              children: [new TextRun({
                text: paragraph.trim(),
                font: "Microsoft YaHei"
              })]
            })
          )
        }]
      });

      // 生成DOCX文件
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      saveAs(blob, `${fileName}.docx`);
    } catch (error) {
      console.error('DOCX生成失败:', error);
      // 如果DOCX生成失败，回退到HTML格式
      downloadAsHtml(htmlContent, fileName);
      message.warning('DOCX格式生成失败，已改为HTML格式下载');
    }
  };

  // 智能提取字段值
  const extractFieldValue = (sourceField: string, formData: any): any => {
    if (sourceField === 'calculated') {
      return null; // 计算字段需要特殊处理
    }
    
    const keys = sourceField.split('.');
    let value = formData;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return value;
  };

  // 智能字段匹配：根据变量名自动匹配表单数据
  const smartFieldMapping = (variableName: string, formData: any): any => {
    const { businessTerms, contractSigned, marketResearch } = formData;
    
    // 常见字段映射规则
    const fieldMappingRules: Record<string, any> = {
      // 甲方信息 - 支持更多变量名格式
      '甲方': contractSigned?.partyA?.companyName,
      '甲方公司': contractSigned?.partyA?.companyName,
      '甲方单位': contractSigned?.partyA?.companyName,
      '甲方名称': contractSigned?.partyA?.companyName,
      'partyA': contractSigned?.partyA?.companyName,
      'partyACompany': contractSigned?.partyA?.companyName,
      'companyA': contractSigned?.partyA?.companyName,
      '甲方地址': contractSigned?.partyA?.companyAddress,
      'partyAAddress': contractSigned?.partyA?.companyAddress,
      '甲方法人': contractSigned?.partyA?.legalRepresentative,
      'partyALegal': contractSigned?.partyA?.legalRepresentative,
      '甲方税号': contractSigned?.partyA?.taxNumber,
      'partyATaxNumber': contractSigned?.partyA?.taxNumber,
      
      // 乙方信息 - 支持更多变量名格式
      '乙方': contractSigned?.partyB?.companyName,
      '乙方公司': contractSigned?.partyB?.companyName,
      '乙方单位': contractSigned?.partyB?.companyName,
      '乙方名称': contractSigned?.partyB?.companyName,
      'partyB': contractSigned?.partyB?.companyName,
      'partyBCompany': contractSigned?.partyB?.companyName,
      'companyB': contractSigned?.partyB?.companyName,
      '乙方地址': contractSigned?.partyB?.companyAddress,
      'partyBAddress': contractSigned?.partyB?.companyAddress,
      '乙方法人': contractSigned?.partyB?.legalRepresentative,
      'partyBLegal': contractSigned?.partyB?.legalRepresentative,
      '乙方税号': contractSigned?.partyB?.taxNumber,
      'partyBTaxNumber': contractSigned?.partyB?.taxNumber,
      
      // 项目信息
      '项目名称': formData.name,
      '项目': formData.name,
      'projectName': formData.name,
      'project': formData.name,
      '项目位置': marketResearch?.location,
      '位置': marketResearch?.location,
      'location': marketResearch?.location,
      
      // 商务条款
      '租赁面积': businessTerms?.leaseArea,
      '面积': businessTerms?.leaseArea,
      'area': businessTerms?.leaseArea,
      'leaseArea': businessTerms?.leaseArea,
      '租赁楼层': businessTerms?.leaseFloor,
      '楼层': businessTerms?.leaseFloor,
      'floor': businessTerms?.leaseFloor,
      '租金': businessTerms?.leasePrice,
      '租赁单价': businessTerms?.leasePrice,
      '单价': businessTerms?.leasePrice,
      'price': businessTerms?.leasePrice,
      'rent': businessTerms?.leasePrice,
      '租期': businessTerms?.leaseTerm,
      '租赁期限': businessTerms?.leaseTerm,
      '年限': businessTerms?.leaseTerm,
      'term': businessTerms?.leaseTerm,
      '起租日': businessTerms?.startDate,
      '开始日期': businessTerms?.startDate,
      'startDate': businessTerms?.startDate,
      '付款方式': businessTerms?.paymentMethod,
      'paymentMethod': businessTerms?.paymentMethod,
      '物业费': businessTerms?.propertyFeePrice,
      'propertyFee': businessTerms?.propertyFeePrice,
    };

    // 计算字段
    if (variableName.includes('结束') || variableName.includes('到期') || variableName === 'endDate') {
      if (businessTerms?.startDate && businessTerms?.leaseTerm) {
        return dayjs(businessTerms.startDate)
          .add(businessTerms.leaseTerm, 'year')
          .subtract(1, 'day')
          .format('YYYY-MM-DD');
      }
    }

    if (variableName.includes('月租') || variableName === 'monthlyRent') {
      if (businessTerms?.leaseArea && businessTerms?.leasePrice) {
        return Math.round(businessTerms.leaseArea * businessTerms.leasePrice * 30.44);
      }
    }

    if (variableName.includes('保证金') || variableName === 'deposit') {
      const depositResult = calculateDepositAmount({ businessTerms });
      return depositResult.totalDeposit;
    }

    // 直接匹配
    if (fieldMappingRules[variableName] !== undefined) {
      return fieldMappingRules[variableName];
    }

    // 模糊匹配
    for (const [pattern, value] of Object.entries(fieldMappingRules)) {
      if (variableName.toLowerCase().includes(pattern.toLowerCase()) || 
          pattern.toLowerCase().includes(variableName.toLowerCase())) {
        return value;
      }
    }

    return null;
  };

  // 替换DOCX文件中的变量
  const replaceVariablesInDocx = async (arrayBuffer: ArrayBuffer, templateData: Record<string, any>): Promise<ArrayBuffer> => {
    try {
      // 使用PizZip解析DOCX文件
      const zip = new PizZip(arrayBuffer);
      
      // 获取document.xml文件（包含主要内容）
      const documentXml = zip.file('word/document.xml')?.asText();
      
      if (!documentXml) {
        throw new Error('无法读取DOCX文件内容');
      }
      
      console.log('原始XML中的变量:');
      const foundVariables = documentXml.match(/{{[^}]*}}/g);
      console.log('找到的变量:', foundVariables);
      console.log('要替换的数据:', templateData);
      
      // 替换变量
      let processedXml = documentXml;
      
      // 首先尝试处理被XML标签分割的变量
      // Word可能将{{partyACompany}}分割为多个<w:t>标签
      processedXml = cleanupSplitVariables(processedXml);
      
      Object.entries(templateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const valueStr = String(value);
          console.log(`替换变量: {{${key}}} -> ${valueStr}`);
          
          // 处理DOCX中的文本节点
          const regex = new RegExp(`{{${key}}}`, 'g');
          const beforeCount = (processedXml.match(regex) || []).length;
          processedXml = processedXml.replace(regex, valueStr);
          const afterCount = (processedXml.match(regex) || []).length;
          
          console.log(`变量 {{${key}}} 替换了 ${beforeCount - afterCount} 次`);
        }
      });
      
      console.log('替换后剩余的变量:');
      const remainingVariables = processedXml.match(/{{[^}]*}}/g);
      console.log('剩余变量:', remainingVariables);
      
      // 清理未替换的变量
      processedXml = processedXml.replace(/{{[^}]*}}/g, '_______');
      
      // 将修改后的内容放回zip
      zip.file('word/document.xml', processedXml);
      
      // 生成新的ArrayBuffer
      const outputBuffer = zip.generate({ 
        type: 'arraybuffer',
        compression: 'DEFLATE'
      });
      
      return outputBuffer;
    } catch (error) {
      console.error('DOCX变量替换失败:', error);
      // 如果替换失败，返回原始文件
      return arrayBuffer;
    }
  };

  // 清理被XML标签分割的变量
  const cleanupSplitVariables = (xml: string): string => {
    // 合并被拆分的 {{xxx}} 变量
    // 匹配 <w:t>{{</w:t><w:t>xxx</w:t><w:t>}}</w:t> 及类似结构
    return xml.replace(
      /<w:t>{{<\/w:t>(?:<[^>]+>)*<w:t>([\w.]+)<\/w:t>(?:<[^>]+>)*<w:t>}}<\/w:t>/g,
      (match, varName) => `<w:t>{{${varName}}}</w:t>`
    );
  };

  // 增强的合同生成函数，支持智能字段映射
  const handleGenerateContractEnhanced = async () => {
    if (!selectedTemplate) {
      message.warning('请先选择合同模板');
      return;
    }

    const formValues = editForm.getFieldsValue();
    const { businessTerms, contractSigned, marketResearch } = formValues;

    // 检查模板是否有字段映射配置
    if (!selectedTemplate.autoMapping) {
      // 如果没有字段映射，使用基础的模板变量提取
      console.log('模板没有字段映射配置，使用基础变量提取方式');
      handleGenerateContract();
      return;
    }

    // 使用模板的autoMapping配置智能提取数据
    const templateData: Record<string, any> = {};
    
    // 调试信息：帮助排查字段映射问题
    console.log('=== 字段映射调试信息 ===');
    console.log('选中模板:', selectedTemplate.name);
    console.log('模板变量:', selectedTemplate.variables);
    console.log('字段映射配置:', selectedTemplate.autoMapping);
    console.log('表单数据:', formValues);
    
    // 处理甲方信息
    if (selectedTemplate.autoMapping.partyA) {
      Object.entries(selectedTemplate.autoMapping.partyA).forEach(([key, templateVar]) => {
        if (templateVar && contractSigned?.partyA?.[key as keyof typeof contractSigned.partyA]) {
          templateData[templateVar] = contractSigned.partyA[key as keyof typeof contractSigned.partyA];
                      // console.log(`甲方字段映射: ${key} -> ${templateVar} = ${templateData[templateVar]}`);
        }
      });
    }

    // 处理乙方信息
    if (selectedTemplate.autoMapping.partyB) {
      Object.entries(selectedTemplate.autoMapping.partyB).forEach(([key, templateVar]) => {
        if (templateVar && contractSigned?.partyB?.[key as keyof typeof contractSigned.partyB]) {
          templateData[templateVar] = contractSigned.partyB[key as keyof typeof contractSigned.partyB];
        }
      });
    }

    // 处理项目信息
    if (selectedTemplate.autoMapping.project) {
      if (selectedTemplate.autoMapping.project.name) {
        templateData[selectedTemplate.autoMapping.project.name] = formValues.name || '';
      }
      if (selectedTemplate.autoMapping.project.location) {
        templateData[selectedTemplate.autoMapping.project.location] = marketResearch?.location || '';
      }
    }

    // 处理商务条款信息
    if (selectedTemplate.autoMapping.businessTerms) {
      Object.entries(selectedTemplate.autoMapping.businessTerms).forEach(([key, templateVar]) => {
        if (templateVar) {
          switch (key) {
            case 'endDate':
              if (businessTerms?.startDate && businessTerms?.leaseTerm) {
                templateData[templateVar] = dayjs(businessTerms.startDate)
                  .add(businessTerms.leaseTerm, 'year')
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD');
              }
              break;
            case 'monthlyRent':
              if (businessTerms?.leaseArea && businessTerms?.leasePrice) {
                templateData[templateVar] = Math.round(businessTerms.leaseArea * businessTerms.leasePrice * 30.44);
              }
              break;
            case 'depositAmount':
              const depositResult = calculateDepositAmount({ businessTerms });
              templateData[templateVar] = depositResult.totalDeposit;
              break;
            case 'freeRentPeriods':
              if (businessTerms?.freeRentPeriods?.length) {
                templateData[templateVar] = businessTerms.freeRentPeriods;
              }
              break;
            default:
              if (businessTerms?.[key as keyof typeof businessTerms]) {
                templateData[templateVar] = businessTerms[key as keyof typeof businessTerms];
              }
          }
        }
      });
    }

    // 自动提取模板变量
    if (selectedTemplate.variables && Array.isArray(selectedTemplate.variables)) {
      selectedTemplate.variables.forEach(variable => {
        if (variable.autoExtract && variable.sourceField && !templateData[variable.key]) {
          const extractedValue = extractFieldValue(variable.sourceField, formValues);
          if (extractedValue !== null) {
            templateData[variable.key] = extractedValue;
            // console.log(`变量自动提取: ${variable.key} = ${extractedValue} (来源: ${variable.sourceField})`);
          }
        }
      });
    }

    // 智能字段匹配：如果字段映射配置为空，尝试根据变量名自动匹配
    if (selectedTemplate.variables && Array.isArray(selectedTemplate.variables)) {
      selectedTemplate.variables.forEach(variable => {
        if (!templateData[variable.key]) {
          const smartValue = smartFieldMapping(variable.key, formValues);
          if (smartValue !== null) {
            templateData[variable.key] = smartValue;
            console.log(`智能字段匹配: ${variable.key} = ${smartValue}`);
          }
        }
      });
    }

    console.log('最终模板数据:', templateData);

    // 根据模板格式生成合同内容
    let generatedContent: string;
    let generatedBuffer: ArrayBuffer | null = null;

    if (selectedTemplate.fileFormat === 'docx' && selectedTemplate.originalBuffer) {
      // DOCX模板处理
      try {
        // 使用简单的字符串替换处理DOCX模板
        const processedBuffer = await replaceVariablesInDocx(selectedTemplate.originalBuffer, templateData);
        
        generatedBuffer = processedBuffer;
        
        // 为了预览，将处理后的DOCX转换为HTML
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: processedBuffer });
        generatedContent = htmlResult.value;
      } catch (error) {
        console.error('DOCX模板处理失败:', error);
        message.error('DOCX模板处理失败，请检查模板格式');
        return;
      }
    } else {
      // HTML模板处理
      generatedContent = selectedTemplate.content;
      
      // 替换所有变量
      Object.entries(templateData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          const regex = new RegExp(`{{${key}}}`, 'g');
          generatedContent = generatedContent.replace(regex, String(value));
        }
      });

      // 处理免租期列表
      if (templateData.freeRentPeriods && Array.isArray(templateData.freeRentPeriods)) {
        const freeRentHtml = templateData.freeRentPeriods
          .map((period: any) => `<li>第${period.year}年：免租${period.days}天</li>`)
          .join('');
        generatedContent = generatedContent.replace(/{{#if freeRentPeriods}}[\s\S]*?{{\/if}}/g, 
          `<h3>第四条 免租期</h3><p>甲方同意给予乙方以下免租期：</p><ul>${freeRentHtml}</ul>`);
      } else {
        generatedContent = generatedContent.replace(/{{#if freeRentPeriods}}[\s\S]*?{{\/if}}/g, '');
      }

      // 清理未替换的变量
      generatedContent = generatedContent.replace(/{{[^}]*}}/g, '___________');
    }

    setGeneratedContractContent(generatedContent);
    setGeneratedContractBuffer(generatedBuffer);
    editForm.setFieldValue(['contractSigned', 'contractTemplate', 'generatedContent'], generatedContent);
    editForm.setFieldValue(['contractSigned', 'contractTemplate', 'templateVariables'], templateData);
    
    message.success('合同内容已智能生成，所有可识别字段已自动填充');
  };

  // 上传自定义模板
  const handleUploadTemplate = async (file: File) => {
    const uploadConfig: TemplateUploadConfig = {
      acceptedFormats: ['.html', '.docx', '.doc'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      variablePattern: /{{(\w+)}}/g,
      autoDetectFields: true
    };

    // 验证文件格式
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!uploadConfig.acceptedFormats.includes(fileExtension)) {
      message.error('不支持的文件格式，请上传 HTML、DOCX 或 DOC 文件');
      return false;
    }

    // 验证文件大小
    if (file.size > uploadConfig.maxFileSize) {
      message.error('文件大小超过限制（最大10MB）');
      return false;
    }

    try {
      // 读取文件内容
      const fileResult = await readFileContent(file);
      
      // 自动检测模板变量
      const detectedVariables = detectTemplateVariables(fileResult.content, uploadConfig.variablePattern);
      
      // 创建新模板对象
      const newTemplate: ContractTemplate = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(fileExtension, ''),
        description: '用户上传的自定义模板',
        type: 'other',
        content: fileResult.content,
        originalBuffer: fileResult.originalBuffer, // 保存原始DOCX二进制数据
        variables: detectedVariables,
        isDefault: false,
        isActive: true,
        isCustom: true,
        fileFormat: fileExtension === '.html' ? 'html' : 'docx',
        originalFileName: file.name,
        autoMapping: createDefaultAutoMapping(),
        createdBy: user?.name || '用户',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        version: '1.0'
      };

      setUploadingTemplate(newTemplate);
      setFieldMappingModalVisible(true);
      
    } catch (error) {
      message.error('文件读取失败，请检查文件格式');
    }

    return false; // 阻止默认上传行为
  };

  // 读取文件内容
  const readFileContent = (file: File): Promise<{ content: string, originalBuffer?: ArrayBuffer }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (fileExtension === '.html') {
          // HTML文件直接读取文本
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve({ content });
          };
          reader.onerror = () => reject(new Error('HTML文件读取失败'));
          reader.readAsText(file, 'UTF-8');
        } else if (fileExtension === '.docx' || fileExtension === '.doc') {
          // DOCX文件保存原始二进制数据和提取的文本
          const arrayBuffer = await file.arrayBuffer();
          
          // 使用mammoth提取纯文本用于变量检测
          const textResult = await mammoth.extractRawText({ arrayBuffer });
          
          resolve({ 
            content: textResult.value,
            originalBuffer: arrayBuffer 
          });
        } else {
          reject(new Error('不支持的文件格式'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // 检测模板变量
  const detectTemplateVariables = (content: string, pattern: RegExp): any[] => {
    const variables: any[] = [];
    const uniqueKeys = new Set<string>();
    let match;

    // 重置正则表达式
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        variables.push({
          key,
          label: key,
          type: 'text',
          required: false,
          autoExtract: false
        });
      }
    }

    return variables;
  };

  // 创建默认字段映射
  const createDefaultAutoMapping = (): AutoFieldMapping => ({
    partyA: {
      companyName: '',
      taxNumber: '',
      companyAddress: '',
      legalRepresentative: ''
    },
    partyB: {
      companyName: '',
      taxNumber: '',
      companyAddress: '',
      legalRepresentative: ''
    },
    project: {
      name: '',
      location: ''
    },
    businessTerms: {
      leaseArea: '',
      leaseFloor: '',
      leasePrice: '',
      leaseTerm: '',
      startDate: '',
      endDate: '',
      paymentMethod: '',
      propertyFeePrice: '',
      freeRentPeriods: '',
      depositAmount: '',
      monthlyRent: ''
    }
  });

  // 保存自定义模板
  const handleSaveCustomTemplate = (mappingConfig: AutoFieldMapping) => {
    if (uploadingTemplate) {
      try {
        const finalTemplate = {
          ...uploadingTemplate,
          autoMapping: mappingConfig || createDefaultAutoMapping(), // 确保有默认配置
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        setContractTemplates(prev => [...prev, finalTemplate]);
        setFieldMappingModalVisible(false);
        setUploadingTemplate(null);
        message.success('自定义模板上传成功，已配置字段映射');
      } catch (error) {
        console.error('保存模板时出错:', error);
        message.error('保存模板失败，请重试');
      }
    }
  };



  // 删除合同模板
  const handleDeleteTemplate = (templateId: string) => {
    const template = contractTemplates.find(t => t.id === templateId);
    if (!template) {
      message.error('模板不存在');
      return;
    }

    // 检查是否正在使用
    if (selectedTemplate?.id === templateId) {
      message.warning('当前选中的模板不能删除，请先选择其他模板');
      return;
    }

    // 系统模板和自定义模板使用不同的确认对话框
    if (!template.isCustom) {
      // 系统模板删除 - 需要更严格的确认
      Modal.confirm({
        title: '⚠️ 警告：删除系统模板',
        content: (
          <div>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#fff1f0', borderRadius: 4, border: '1px solid #ffccc7' }}>
              <p style={{ margin: 0, color: '#cf1322', fontWeight: 'bold' }}>
                <strong>🚨 高风险操作：</strong>您即将删除系统模板 <strong>"{template.name}"</strong>
              </p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '8px 0', color: '#8c8c8c' }}>
                <strong>模板信息：</strong>
              </p>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#8c8c8c' }}>
                <li>模板类型：{template.isDefault ? '默认系统模板' : '系统模板'}</li>
                <li>创建人：{template.createdBy}</li>
                <li>版本：{template.version}</li>
                <li>最后更新：{template.updatedAt}</li>
              </ul>
            </div>
            <div style={{ padding: 12, backgroundColor: '#fff7e6', borderRadius: 4, border: '1px solid #ffd591' }}>
              <p style={{ margin: 0, color: '#d48806' }}>
                <strong>⚠️ 删除后果：</strong>
              </p>
              <ul style={{ margin: '8px 0', paddingLeft: 20, color: '#d48806' }}>
                <li>此模板将永久删除，无法恢复</li>
                <li>已使用此模板生成的合同不受影响</li>
                <li>其他用户将无法再使用此模板</li>
                <li>如果是默认模板，请确保有其他模板可替代</li>
              </ul>
            </div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#cf1322', fontSize: '14px' }}>
                请再次确认您要删除系统模板 <strong>"{template.name}"</strong>
              </p>
            </div>
          </div>
        ),
        okText: '确认删除系统模板',
        cancelText: '取消',
        okType: 'danger',
        width: 600,
        onOk: () => {
          setContractTemplates(prev => prev.filter(t => t.id !== templateId));
          // 如果删除的是当前选中的模板，清空选择
          if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(null);
          }
          message.success(`系统模板 "${template.name}" 已删除`);
        }
      });
    } else {
      // 自定义模板删除 - 使用原有的确认方式
      Modal.confirm({
        title: '确认删除自定义模板',
        content: (
          <div>
            <p>确定要删除自定义模板 <strong>"{template.name}"</strong> 吗？</p>
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#fff2e8', borderRadius: 4 }}>
              <p style={{ margin: 0, color: '#d48806' }}>
                <strong>⚠️ 注意：</strong>删除后无法恢复，如果有项目使用了此模板生成的合同，不会受到影响。
              </p>
            </div>
          </div>
        ),
        okText: '确认删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          setContractTemplates(prev => prev.filter(t => t.id !== templateId));
          // 如果删除的是当前选中的模板，清空选择
          if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(null);
          }
          message.success(`自定义模板 "${template.name}" 已删除`);
        }
      });
    }
  };

  // 编辑模板配置
  const handleEditTemplate = (template: ContractTemplate) => {
    setUploadingTemplate(template);
    setFieldMappingModalVisible(true);
  };

  // 解析付款方式，提取押几付几
  const parsePaymentMethod = (paymentMethod: string) => {
    const match = paymentMethod.match(/押(\d+)付(\d+)/);
    if (match) {
      return {
        deposit: parseInt(match[1]), // 押几
        payment: parseInt(match[2])  // 付几
      };
    }
    return { deposit: 0, payment: 0 };
  };

  // 计算租赁保证金
  const calculateDepositAmount = (formData: any) => {
    if (!formData.businessTerms) return { rentDeposit: 0, propertyDeposit: 0, totalDeposit: 0 };

    const { leaseArea, leasePrice, propertyFeePrice, paymentMethod, depositItems } = formData.businessTerms;
    const { deposit } = parsePaymentMethod(paymentMethod || '');
    
    let rentDeposit = 0;
    let propertyDeposit = 0;

    if (depositItems?.includes('租金') && leaseArea && leasePrice && deposit) {
      // 租金保证金 = 租金单价 * 面积 * 365/12 * 押几
      rentDeposit = leasePrice * leaseArea * (365 / 12) * deposit;
    }

    if (depositItems?.includes('物业费') && leaseArea && propertyFeePrice && deposit) {
      // 物业费保证金 = 物业费单价 * 面积 * 押几
      propertyDeposit = propertyFeePrice * leaseArea * deposit;
    }

    return {
      rentDeposit: Math.round(rentDeposit),
      propertyDeposit: Math.round(propertyDeposit),
      totalDeposit: Math.round(rentDeposit + propertyDeposit)
    };
  };

  // 计算免租期开始和结束日期
  const calculateFreeRentDates = (
    contractStartDate: any, 
    year: number, 
    days: number, 
    customStartDate?: any
  ): { startDate: dayjs.Dayjs, endDate: dayjs.Dayjs } | null => {
    if (!contractStartDate || !year || days === undefined || days === null) {
      return null;
    }
  
    const baseStartDate = dayjs(contractStartDate);
    if (!baseStartDate.isValid()) return null;
  
    // 1. 确定有效的开始日期
    let effectiveStartDate: dayjs.Dayjs;
    if (customStartDate && dayjs(customStartDate).isValid()) {
      // 如果用户提供了有效的自定义开始日期，则使用它
      effectiveStartDate = dayjs(customStartDate);
    } else {
      // 否则，根据年份计算默认开始日期
      // 第1年从合同起租日开始，第N年从合同起租日的 N-1 周年纪念日开始
      effectiveStartDate = baseStartDate.add(year - 1, 'year');
    }
  
    // 2. 计算结束日期
    // 结束日期 = 有效开始日期 + 免租天数 - 1 天 (例如，1号开始免租10天，应该是10号结束)
    const effectiveDays = days > 0 ? days - 1 : 0;
    const endDate = effectiveStartDate.add(effectiveDays, 'day');
  
    return {
      startDate: effectiveStartDate,
      endDate: endDate
    };
  };

  // 计算首期款
  const calculateFirstPayment = (formData: any) => {
    if (!formData.businessTerms) return { rentPayment: 0, propertyPayment: 0, totalPayment: 0, paymentDays: 0 };

    const { 
      leaseArea, 
      leasePrice, 
      propertyFeePrice, 
      paymentMethod, 
      startDate,
      freeRentPeriods,
      propertyFeeFreeRentPeriods,
      propertyFeeCalculationMethod // 物业费计费方式：'sync_with_rent' | 'independent'
    } = formData.businessTerms;
    
    const { payment } = parsePaymentMethod(paymentMethod || '');
    
    if (!startDate || !payment) return { rentPayment: 0, propertyPayment: 0, totalPayment: 0, paymentDays: 0 };

    const startDateObj = dayjs(startDate);
    
    // 计算租金首期款开始日期（考虑第一年免租期）
    let rentPaymentStartDate = startDateObj;
    const firstYearFreeRent = freeRentPeriods?.find((period: any) => period.year === 1);
    if (firstYearFreeRent && firstYearFreeRent.days > 0) {
      // 使用免租期结束的次日作为租金开始计算日期
      const freeRentDates = calculateFreeRentDates(
        startDate, 
        1, 
        firstYearFreeRent.days, 
        firstYearFreeRent.startDate
      );
      rentPaymentStartDate = dayjs(freeRentDates?.endDate).add(1, 'day');
    }

    // 计算物业费首期款开始日期和结束日期
    let propertyPaymentStartDate = startDateObj;
    let propertyPaymentEndDate = startDateObj.add(payment, 'month');
    let propertyPaymentDays = 0;

    if (propertyFeeCalculationMethod === 'sync_with_rent') {
      // 物业费与租金同步计费
      // 检查物业费是否有免租期
      const firstYearPropertyFreeRent = propertyFeeFreeRentPeriods?.find((period: any) => period.year === 1);
      if (firstYearPropertyFreeRent && firstYearPropertyFreeRent.days > 0) {
        // 物业费有免租期，按照物业费免租期计算
        const propertyFreeRentDates = calculateFreeRentDates(
          startDate, 
          1, 
          firstYearPropertyFreeRent.days, 
          firstYearPropertyFreeRent.startDate
        );
        propertyPaymentStartDate = dayjs(propertyFreeRentDates?.endDate).add(1, 'day');
      } else {
        // 物业费没有免租期，从起租日开始，但结束日期与租金首期结束时间一致
        propertyPaymentStartDate = startDateObj;
      }
      propertyPaymentEndDate = rentPaymentStartDate.add(payment, 'month');
      propertyPaymentDays = propertyPaymentEndDate.diff(propertyPaymentStartDate, 'day');
    } else {
      // 物业费独立计费周期（从合同开始日期计算，考虑物业费免租期）
      const firstYearPropertyFreeRent = propertyFeeFreeRentPeriods?.find((period: any) => period.year === 1);
      if (firstYearPropertyFreeRent && firstYearPropertyFreeRent.days > 0) {
        // 物业费有免租期
        const propertyFreeRentDates = calculateFreeRentDates(
          startDate, 
          1, 
          firstYearPropertyFreeRent.days, 
          firstYearPropertyFreeRent.startDate
        );
        propertyPaymentStartDate = dayjs(propertyFreeRentDates?.endDate).add(1, 'day');
      } else {
        // 物业费没有免租期，从合同开始日期计算
        propertyPaymentStartDate = startDateObj;
      }
      propertyPaymentEndDate = propertyPaymentStartDate.add(payment, 'month');
      propertyPaymentDays = propertyPaymentEndDate.diff(propertyPaymentStartDate, 'day');
    }

    // 首期款结束日期 = 开始日期 + 付几个月
    const rentPaymentEndDate = rentPaymentStartDate.add(payment, 'month');

    // 计算天数
    const rentPaymentDays = rentPaymentEndDate.diff(rentPaymentStartDate, 'day');

    // 计算金额
    const rentPayment = leaseArea && leasePrice ? leasePrice * leaseArea * rentPaymentDays : 0;
    const propertyPayment = leaseArea && propertyFeePrice ? (propertyFeePrice * leaseArea * propertyPaymentDays) / 30 : 0; // 物业费按月计算

    return {
      rentPayment: Math.round(rentPayment),
      propertyPayment: Math.round(propertyPayment),
      totalPayment: Math.round(rentPayment + propertyPayment),
      paymentDays: Math.max(rentPaymentDays, propertyPaymentDays),
      rentPaymentStartDate: rentPaymentStartDate.format('YYYY-MM-DD'),
      rentPaymentEndDate: rentPaymentEndDate.format('YYYY-MM-DD'),
      propertyPaymentStartDate: propertyPaymentStartDate.format('YYYY-MM-DD'),
      propertyPaymentEndDate: propertyPaymentEndDate.format('YYYY-MM-DD')
    };
  };

  // 计算合同总金额
  const calculateTotalContractAmount = (formData: any) => {
    if (!formData.businessTerms) return { totalRent: 0, totalPropertyFee: 0, grandTotal: 0, details: [] };

    const { 
      leaseArea, 
      leasePrice, 
      propertyFeePrice, 
      leaseTerm,
      startDate,
      freeRentPeriods,
      rentIncreases
    } = formData.businessTerms;

    if (!leaseArea || !leasePrice || !propertyFeePrice || !leaseTerm || !startDate) {
      return { totalRent: 0, totalPropertyFee: 0, grandTotal: 0, details: [] };
    }

    const startDateObj = dayjs(startDate);
    const details = [];
    let totalRent = 0;

    // 计算每一年的租金
    for (let year = 1; year <= leaseTerm; year++) {
      const yearStartDate = startDateObj.add(year - 1, 'year');
      const yearEndDate = startDateObj.add(year, 'year').subtract(1, 'day');
      
      // 计算这一年的天数
      let yearDays = yearEndDate.diff(yearStartDate, 'day') + 1;
      
      // 如果是最后一年，需要精确计算到合同结束日期
      if (year === leaseTerm) {
        const contractEndDate = startDateObj.add(leaseTerm, 'year').subtract(1, 'day');
        yearDays = contractEndDate.diff(yearStartDate, 'day') + 1;
      }

      // 获取这一年的免租期
      const freeRentPeriod = freeRentPeriods?.find((period: any) => period.year === year);
      const freeRentDays = freeRentPeriod?.days || 0;
      
      // 计算实际收费天数
      const chargingDays = Math.max(0, yearDays - freeRentDays);

      // 确定这一年的租金单价（考虑递增）
      let currentRentPrice = leasePrice;
      if (rentIncreases && rentIncreases.length > 0) {
        // 找到适用于当前年份的最新租金递增
        const applicableIncrease = rentIncreases
          .filter((increase: any) => dayjs(increase.increaseTime).isBefore(yearEndDate) || dayjs(increase.increaseTime).isSame(yearEndDate))
          .sort((a: any, b: any) => dayjs(b.increaseTime).unix() - dayjs(a.increaseTime).unix())[0];
        
        if (applicableIncrease) {
          currentRentPrice = applicableIncrease.increasedPrice;
        }
      }

      // 计算这一年的租金
      const yearRent = currentRentPrice * leaseArea * chargingDays;
      totalRent += yearRent;

      details.push({
        year,
        yearDays,
        freeRentDays,
        chargingDays,
        rentPrice: currentRentPrice,
        yearRent: Math.round(yearRent),
        dateRange: `${yearStartDate.format('YYYY-MM-DD')} ~ ${year === leaseTerm ? startDateObj.add(leaseTerm, 'year').subtract(1, 'day').format('YYYY-MM-DD') : yearEndDate.format('YYYY-MM-DD')}`
      });
    }

    // 计算物业费总额（物业费通常没有免租期，按月计算）
    const totalPropertyFee = propertyFeePrice * leaseArea * leaseTerm * 12;
    
    // 计算总金额
    const grandTotal = totalRent + totalPropertyFee;

    return {
      totalRent: Math.round(totalRent),
      totalPropertyFee: Math.round(totalPropertyFee),
      grandTotal: Math.round(grandTotal),
      details
    };
  };

  return (
    <div style={{ 
      padding: '32px', 
      background: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '32px' }}>
        <Title 
          level={2} 
          style={{ 
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0,
            letterSpacing: '0.5px'
          }}
        >
          潜在项目池
        </Title>
      </div>

      {/* 美化的筛选器容器 */}
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
        bodyStyle={{ 
          padding: '24px 32px' 
        }}
      >
        <Form
          form={form}
          onFinish={handleSearch}
          style={{ width: '100%' }}
        >
          <Row gutter={[24, 16]} align="middle">
            {/* 第一行筛选器 */}
            <Col flex="auto">
              <Row gutter={[20, 16]} align="middle">
                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      项目名称
                    </Text>
                    <Form.Item name="name" style={{ margin: 0 }}>
                      <Input
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="请输入项目关键词"
                        allowClear
                        style={{ 
                          width: '200px',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
                
                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      项目阶段
                    </Text>
                    <Form.Item name="projectPhase" style={{ margin: 0 }}>
                      <Select
                        mode="multiple"
                        placeholder="请选择项目阶段"
                        style={{ 
                          width: '180px',
                          borderRadius: '8px'
                        }}
                        allowClear
                        maxTagCount={1}
                        maxTagPlaceholder="..."
                      >
                        {phaseOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                
                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      项目优先级
                    </Text>
                    <Form.Item name="priority" style={{ margin: 0 }}>
                      <Select
                        mode="multiple"
                        placeholder="请选择优先级"
                        style={{ 
                          width: '140px',
                          borderRadius: '8px'
                        }}
                        allowClear
                        maxTagCount={1}
                        maxTagPlaceholder="..."
                      >
                        {priorityOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                
                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      跟进人
                    </Text>
                    <Form.Item name="followUpBy" style={{ margin: 0 }}>
                      <Select
                        placeholder="请选择跟进人"
                        style={{ 
                          width: '140px',
                          borderRadius: '8px'
                        }}
                        allowClear
                      >
                        {getUserOptions().map(user => (
                          <Option key={user.value} value={user.value}>
                            {user.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                
                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      跟进时间
                    </Text>
                    <Form.Item name="lastFollowUpTimeRange" style={{ margin: 0 }}>
                      <RangePicker 
                        placeholder={['开始时间', '结束时间']}
                        suffixIcon={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                        style={{ 
                          width: '220px',
                          borderRadius: '8px'
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Col>
            
            {/* 操作按钮 */}
            <Col>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                alignItems: 'center',
                paddingTop: '20px'
              }}>
                <Button 
                  onClick={handleReset}
                  style={{ 
                    border: 'none',
                    color: '#666',
                    fontSize: '14px',
                    padding: '4px 16px',
                    height: '32px'
                  }}
                >
                  重置
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                  style={{ 
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '4px 20px',
                    height: '36px',
                    background: '#1890ff',
                    borderColor: '#1890ff',
                    boxShadow: '0 2px 4px rgba(24,144,255,0.2)'
                  }}
                >
                  查询
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 操作按钮区 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ 
                borderRadius: '8px',
                height: '36px'
              }}
            >
              新增项目
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
              style={{ 
                borderRadius: '8px',
                height: '36px'
              }}
            >
              导出Excel
            </Button>
          </Space>
        </div>

        {/* 项目列表表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={isEditing ? "编辑项目" : "新增项目"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <Form
          form={editForm}
          onFinish={handleSave}
          layout="vertical"
          scrollToFirstError
        >
          {/* 基础信息卡片 */}
          <Card 
            title="基础信息" 
            size="small" 
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="项目名称"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="projectPhase"
                  label="项目阶段"
                  rules={[{ required: true, message: '请选择项目阶段' }]}
                >
                  <Select 
                    placeholder="请选择项目阶段"
                    onChange={(value) => setCurrentPhase(value)}
                  >
                    {phaseOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="priority"
                  label="项目优先级"
                  rules={[{ required: true, message: '请选择项目优先级' }]}
                >
                  <Select placeholder="请选择项目优先级">
                    {priorityOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="nextFollowUpTime"
                  label="下次跟进时间"
                  rules={[{ required: true, message: '请选择下次跟进时间' }]}
                >
                  <DatePicker 
                    showTime 
                    style={{ width: '100%' }} 
                    placeholder="请选择下次跟进时间" 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="followUpBy"
                  label="跟进人"
                  rules={[{ required: true, message: '请选择跟进人' }]}
                >
                  <Select placeholder="请选择跟进人">
                    {getUserOptions().map(user => (
                      <Option key={user.value} value={user.value}>
                        {user.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="notes"
                  label="备注"
                >
                  <Input placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 阶段特有信息卡片 */}
          <Card 
            title={`${currentPhase}阶段信息`} 
            size="small"
          >
            {renderPhaseFields(currentPhase)}
          </Card>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {isEditing ? '更新' : '添加'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="项目详情"
        placement="right"
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        width={600}
      >
        {currentRecord && (
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Title level={4}>{currentRecord.name}</Title>
                  </Col>
                  
                  <Col span={12}>
                    <Text strong>项目阶段: </Text>
                    <Tag color={phaseOptions.find(p => p.value === currentRecord.projectPhase)?.color}>
                      {currentRecord.projectPhase}
                    </Tag>
                  </Col>
                  
                  <Col span={12}>
                    <Text strong>项目优先级: </Text>
                    <Tag color={priorityOptions.find(p => p.value === currentRecord.priority)?.color}>
                      {currentRecord.priority}
                    </Tag>
                  </Col>
                  
                  <Col span={12}>
                    <Text strong>下次跟进时间: </Text>
                    <Text>{dayjs(currentRecord.nextFollowUpTime).format('YYYY-MM-DD HH:mm')}</Text>
                  </Col>
                  
                  <Col span={12}>
                    <Text strong>跟进人: </Text>
                    <Text>{currentRecord.followUpBy}</Text>
                  </Col>
                  
                  {currentRecord.notes && (
                    <Col span={24}>
                      <Text strong>备注: </Text>
                      <Text>{currentRecord.notes}</Text>
                    </Col>
                  )}
                </Row>

                <Divider />

                {/* 按照阶段顺序显示所有信息，从新到旧 */}
                
                {/* 已放弃阶段 */}
                {currentRecord.projectPhase === '已放弃' && currentRecord.abandoned && (
                  <div style={{ marginBottom: 24 }}>
                    <Card size="small" title="已放弃" headStyle={{ backgroundColor: '#f5f5f5' }}>
                      <Text strong>放弃原因：</Text>
                      <Text>{currentRecord.abandoned.reason}</Text>
                    </Card>
                  </div>
                )}

                {/* 签订合同阶段 */}
                {currentRecord.contractSigned && (
                  <div style={{ marginBottom: 24 }}>
                    <Card 
                      size="small" 
                      title="签订合同" 
                      headStyle={{ 
                        backgroundColor: currentRecord.projectPhase === '签订合同' ? '#e6f7ff' : '#f5f5f5',
                        fontWeight: currentRecord.projectPhase === '签订合同' ? 'bold' : 'normal'
                      }}
                    >
                      {/* 商务条款联系信息 */}
                      {currentRecord.businessTerms && (currentRecord.businessTerms.contact || currentRecord.businessTerms.contactPhone) && (
                        <div style={{ marginBottom: 16 }}>
                          <Card size="small" title="商务条款联系信息" style={{ backgroundColor: '#f0f9ff' }}>
                            <Row gutter={16}>
                              {currentRecord.businessTerms.contact && (
                      <Col span={12}>
                                  <Text strong>联系人：</Text>
                                  <Text>{currentRecord.businessTerms.contact}</Text>
                      </Col>
                              )}
                              {currentRecord.businessTerms.contactPhone && (
                      <Col span={12}>
                                  <Text strong>联系电话：</Text>
                                  <Text>{currentRecord.businessTerms.contactPhone}</Text>
                      </Col>
                              )}
                            </Row>
                          </Card>
                        </div>
                      )}

                      {/* 甲方信息 */}
                      {currentRecord.contractSigned.partyA && (
                        <div style={{ marginBottom: 16 }}>
                          <Card size="small" title="甲方信息">
                            <Row gutter={[16, 8]}>
                      <Col span={12}>
                                <Text strong>企业单位：</Text>
                                <Text>{currentRecord.contractSigned.partyA.companyName}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>税号：</Text>
                                <Text>{currentRecord.contractSigned.partyA.taxNumber}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>公司地址：</Text>
                                <Text>{currentRecord.contractSigned.partyA.companyAddress}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>法定代表人：</Text>
                                <Text>{currentRecord.contractSigned.partyA.legalRepresentative}</Text>
                      </Col>
                    </Row>
                          </Card>
                  </div>
                )}

                      {/* 乙方信息 */}
                      {currentRecord.contractSigned.partyB && (
                        <div style={{ marginBottom: 16 }}>
                          <Card size="small" title="乙方信息">
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                                <Text strong>企业单位：</Text>
                                <Text>{currentRecord.contractSigned.partyB.companyName}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>税号：</Text>
                                <Text>{currentRecord.contractSigned.partyB.taxNumber}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>公司地址：</Text>
                                <Text>{currentRecord.contractSigned.partyB.companyAddress}</Text>
                      </Col>
                      <Col span={12}>
                                <Text strong>法定代表人：</Text>
                                <Text>{currentRecord.contractSigned.partyB.legalRepresentative}</Text>
                      </Col>
                    </Row>
                          </Card>
                  </div>
                )}

                      {/* 合同文件 */}
                  <div>
                        <Text strong>合同文件：</Text>
                        <List
                          size="small"
                          dataSource={currentRecord.contractSigned.contractFiles}
                          renderItem={(file) => (
                            <List.Item>
                              <Text>{file.name}</Text>
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                {dayjs(file.uploadTime).format('YYYY-MM-DD')}
                              </Text>
                            </List.Item>
                          )}
                        />
                      </div>
                    </Card>
                  </div>
                )}

                {/* 商务条款阶段 */}
                {currentRecord.businessTerms && (
                  <div style={{ marginBottom: 24 }}>
                    <Card 
                      size="small" 
                      title="商务条款" 
                      headStyle={{ 
                        backgroundColor: currentRecord.projectPhase === '商务条款' ? '#e6f7ff' : '#f5f5f5',
                        fontWeight: currentRecord.projectPhase === '商务条款' ? 'bold' : 'normal'
                      }}
                    >
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                          <Text strong>联系人：</Text>
                        <Text>{currentRecord.businessTerms.contact}</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>联系电话：</Text>
                        <Text>{currentRecord.businessTerms.contactPhone}</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>租赁面积：</Text>
                        <Text>{currentRecord.businessTerms.leaseArea?.toLocaleString()} ㎡</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>租赁楼层：</Text>
                        <Text>{currentRecord.businessTerms.leaseFloor}</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>租赁单价：</Text>
                        <Text>¥{currentRecord.businessTerms.leasePrice}/㎡/天</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>租赁年限：</Text>
                        <Text>{currentRecord.businessTerms.leaseTerm} 年</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>物业费单价：</Text>
                        <Text>¥{currentRecord.businessTerms.propertyFeePrice}/㎡/月</Text>
                      </Col>
                      <Col span={12}>
                          <Text strong>物业费计费方式：</Text>
                          <Text>
                            {currentRecord.businessTerms.propertyFeeCalculationMethod === 'sync_with_rent' ? '与租金同步' : '独立计费周期'}
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>合作意向：</Text>
                        <Progress
                          percent={currentRecord.businessTerms.intentionLevel}
                          style={{ width: 150 }}
                        />
                      </Col>
                    </Row>
                    
                    {currentRecord.businessTerms.rentIncreases && currentRecord.businessTerms.rentIncreases.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                          <Text strong>租金递增：</Text>
                        <List
                          size="small"
                          dataSource={currentRecord.businessTerms.rentIncreases}
                          renderItem={(item) => (
                            <List.Item>
                              {item.increaseTime}: ¥{item.increasedPrice}/㎡/天
                            </List.Item>
                          )}
                        />
                      </div>
                    )}
                    
                    {currentRecord.businessTerms.freeRentPeriods && currentRecord.businessTerms.freeRentPeriods.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                          <Text strong>租金免租期：</Text>
                        <List
                          size="small"
                          dataSource={currentRecord.businessTerms.freeRentPeriods}
                          renderItem={(item) => (
                            <List.Item>
                              第{item.year}年: {item.days}天
                              {item.startDate && ` (${item.startDate} ~ ${item.endDate})`}
                            </List.Item>
                          )}
                        />
                      </div>
                    )}

                      {currentRecord.businessTerms.propertyFeeFreeRentPeriods && currentRecord.businessTerms.propertyFeeFreeRentPeriods.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <Text strong>物业费免租期：</Text>
                          <List
                            size="small"
                            dataSource={currentRecord.businessTerms.propertyFeeFreeRentPeriods}
                            renderItem={(item) => (
                              <List.Item>
                                第{item.year}年: {item.days}天
                                {item.startDate && ` (${item.startDate} ~ ${item.endDate})`}
                              </List.Item>
                            )}
                          />
                        </div>
                      )}

                    {/* 自动计算结果展示 */}
                    <Divider style={{ margin: '16px 0' }}>自动计算结果</Divider>
                    {(() => {
                      const formData = { businessTerms: currentRecord.businessTerms };
                      const depositResult = calculateDepositAmount(formData);
                      const paymentResult = calculateFirstPayment(formData);
                        const totalAmountResult = calculateTotalContractAmount(formData);

                      return (
                          <div>
                            {/* 第一行：保证金和首期款 */}
                            <Row gutter={16} style={{ marginBottom: 16 }}>
                          <Col span={12}>
                            <Card size="small" title="租赁保证金" style={{ backgroundColor: '#f0f9ff' }}>
                              <div style={{ fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span>租金保证金：</span>
                                  <span>¥{depositResult.rentDeposit.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span>物业费保证金：</span>
                                  <span>¥{depositResult.propertyDeposit.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '4px', fontWeight: 'bold' }}>
                                  <span>保证金总计：</span>
                                  <span style={{ color: '#1890ff' }}>¥{depositResult.totalDeposit.toLocaleString()}</span>
                                </div>
                              </div>
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card size="small" title="首期款" style={{ backgroundColor: '#f6ffed' }}>
                              <div style={{ fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span>首期租金：</span>
                                  <span>¥{paymentResult.rentPayment.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span>首期物业费：</span>
                                  <span>¥{paymentResult.propertyPayment.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '4px', fontWeight: 'bold' }}>
                                  <span>首期款总计：</span>
                                  <span style={{ color: '#52c41a' }}>¥{paymentResult.totalPayment.toLocaleString()}</span>
                                </div>
                                {paymentResult.rentPaymentStartDate && (
                                  <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                                    <div>租金期间：{paymentResult.rentPaymentStartDate} ~ {paymentResult.rentPaymentEndDate}</div>
                                    <div>物业期间：{paymentResult.propertyPaymentStartDate} ~ {paymentResult.propertyPaymentEndDate}</div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </Col>
                        </Row>

                            {/* 第二行：合同总金额 */}
                            {totalAmountResult.grandTotal > 0 && (
                              <Row gutter={16}>
                                <Col span={24}>
                                  <Card 
                                    size="small" 
                                    title="合同总金额" 
                                    style={{ backgroundColor: '#fff7e6', border: '2px solid #ffa940' }}
                                  >
                                    <Row gutter={16}>
                                      <Col span={12}>
                                        <div style={{ fontSize: '13px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 'bold' }}>签约租金总额：</span>
                                            <span style={{ color: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}>
                                              ¥{totalAmountResult.totalRent.toLocaleString()}
                                            </span>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 'bold' }}>物业费总额：</span>
                                            <span style={{ color: '#52c41a', fontSize: '14px', fontWeight: 'bold' }}>
                                              ¥{totalAmountResult.totalPropertyFee.toLocaleString()}
                                            </span>
                                          </div>
                                          <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            borderTop: '2px solid #ffa940', 
                                            paddingTop: '6px', 
                                            fontSize: '16px', 
                                            fontWeight: 'bold' 
                                          }}>
                                            <span>合同总金额：</span>
                                            <span style={{ color: '#f5222d' }}>
                                              ¥{totalAmountResult.grandTotal.toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </Col>
                                      <Col span={12}>
                                        <div style={{ fontSize: '11px', color: '#666' }}>
                                          <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>各年度租金明细：</div>
                                          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                            {totalAmountResult.details.map((detail, index) => (
                                              <div key={index} style={{ marginBottom: '3px', padding: '3px', backgroundColor: '#f9f9f9', borderRadius: '3px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                  <span>第{detail.year}年：</span>
                                                  <span>¥{detail.yearRent.toLocaleString()}</span>
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#999' }}>
                                                  ¥{detail.rentPrice}/㎡/天 × {detail.chargingDays}天
                                                  {detail.freeRentDays > 0 && ` (免租${detail.freeRentDays}天)`}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>
                              </Row>
                            )}
                          </div>
                      );
                    })()}
                    </Card>
                  </div>
                )}

                {/* 市场调研阶段 */}
                {currentRecord.marketResearch && (
                  <div style={{ marginBottom: 24 }}>
                    <Card 
                      size="small"
                      title="市场调研" 
                      headStyle={{ 
                        backgroundColor: currentRecord.projectPhase === '市场调研' ? '#e6f7ff' : '#f5f5f5',
                        fontWeight: currentRecord.projectPhase === '市场调研' ? 'bold' : 'normal'
                      }}
                    >
                      <Row gutter={[16, 8]}>
                        <Col span={24}>
                          <Text strong>运营类型：</Text>
                          {currentRecord.marketResearch.operationType?.map(type => (
                            <Tag key={type} color="blue" style={{ marginLeft: 8 }}>
                              {type}
                            </Tag>
                          ))}
                        </Col>
                        <Col span={24}>
                          <Text strong><EnvironmentOutlined /> 所在位置：</Text>
                          <Text style={{ marginLeft: 8 }}>{currentRecord.marketResearch.location}</Text>
                        </Col>
                        <Col span={24}>
                          <Text strong>产权方信息：</Text>
                          <Text style={{ marginLeft: 8 }}>{currentRecord.marketResearch.propertyOwnerInfo}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>楼宇标准：</Text>
                          <Text>{currentRecord.marketResearch.buildingStandard}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>是否独家：</Text>
                          <Text>{currentRecord.marketResearch.isExclusive ? '是' : '否'}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>市场价：</Text>
                          <Text>¥{currentRecord.marketResearch.marketPrice}/㎡/天</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>出租率：</Text>
                          <Text>{currentRecord.marketResearch.occupancyRate}%</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>是否孵化器：</Text>
                          <Text>{currentRecord.marketResearch.isIncubator ? '是' : '否'}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>合作意向：</Text>
                          <Progress
                            percent={currentRecord.marketResearch.intentionLevel}
                            style={{ width: 150 }}
                          />
                        </Col>
                        {currentRecord.marketResearch.buildDate && (
                          <Col span={12}>
                            <Text strong>建设时间：</Text>
                            <Text>{currentRecord.marketResearch.buildDate}</Text>
                          </Col>
                        )}
                        {currentRecord.marketResearch.propertyCompany && (
                          <Col span={12}>
                            <Text strong>物业公司：</Text>
                            <Text>{currentRecord.marketResearch.propertyCompany}</Text>
                          </Col>
                        )}
                        {currentRecord.marketResearch.historicalOperator && (
                          <Col span={12}>
                            <Text strong>历史运营商：</Text>
                            <Text>{currentRecord.marketResearch.historicalOperator}</Text>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </div>
                )}


              </TabPane>

              <TabPane tab="跟进记录" key="2">
                {/* 添加新跟进 */}
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Form
                    form={followUpForm}
                    onFinish={handleAddFollowUp}
                    layout="vertical"
                  >
                    <Form.Item
                      name="content"
                      label="添加跟进记录"
                      rules={[{ required: true, message: '请输入跟进内容' }]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="请输入跟进内容..."
                      />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button type="primary" htmlType="submit" size="small">
                        添加记录
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* 跟进记录列表 */}
                <Timeline>
                  {currentRecord.followUpRecords.map((record) => (
                    <Timeline.Item
                      key={record.id}
                      dot={<UserOutlined />}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>{record.user}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          <CalendarOutlined /> {record.time}
                        </Text>
                      </div>
                      <div>{record.content}</div>
                    </Timeline.Item>
                  ))}
                </Timeline>

                {currentRecord.followUpRecords.length === 0 && (
                  <Alert
                    message="暂无跟进记录"
                    type="info"
                    showIcon
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>

      {/* 合同模板选择弹窗 */}
      <Modal
        title="选择合同模板"
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={null}
        width={800}
      >
        <List
          dataSource={contractTemplates.filter(template => template.isActive)}
          renderItem={(template) => (
            <List.Item
              style={{ 
                cursor: 'pointer',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                marginBottom: 12,
                padding: 16
              }}
              onClick={() => handleSelectTemplate(template)}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: '16px' }}>{template.name}</Text>
                    {template.isDefault && <Tag color="blue">默认</Tag>}
                    {template.isCustom && <Tag color="orange">自定义</Tag>}
                    <Tag color="green">{template.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <p style={{ margin: '8px 0', color: '#666' }}>{template.description}</p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      <span>创建人：{template.createdBy}</span>
                      <span style={{ marginLeft: 16 }}>版本：{template.version}</span>
                      <span style={{ marginLeft: 16 }}>更新时间：{dayjs(template.updatedAt).format('YYYY-MM-DD')}</span>
                    </div>
                  </div>
                }
              />
              <Space>
                <Button type="primary" size="small">
                  选择此模板
                </Button>
                {template.isCustom ? (
                  <>
                    <Button 
                      size="small" 
                      icon={<SettingOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template);
                      }}
                    >
                      编辑
                    </Button>
                    <Button 
                      size="small" 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                    >
                      删除
                    </Button>
                  </>
                ) : (
                  <>
                    <Tag color="blue">系统模板</Tag>
                    <Button 
                      size="small" 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      title="删除系统模板（高风险操作）"
                    >
                      删除
                    </Button>
                  </>
                )}
              </Space>
            </List.Item>
          )}
        />
      </Modal>

      {/* 合同预览弹窗 */}
      <Modal
        title="合同预览"
        open={contractPreviewVisible}
        onCancel={() => setContractPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="download" type="primary" onClick={handleDownloadContract} icon={<DownloadOutlined />}>
            下载合同
          </Button>,
          <Button key="close" onClick={() => setContractPreviewVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div 
          style={{ 
            maxHeight: '70vh', 
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '6px'
          }}
          dangerouslySetInnerHTML={{ __html: generatedContractContent }}
        />
      </Modal>

      {/* 字段映射配置弹窗 */}
      <Modal
        title={uploadingTemplate?.id.startsWith('custom_') ? '编辑模板字段映射' : '配置模板字段映射'}
        open={fieldMappingModalVisible}
        onCancel={() => {
          setFieldMappingModalVisible(false);
          setUploadingTemplate(null);
        }}
        width={1200}
        footer={null}
      >
        {uploadingTemplate && (
          <div>
            <Alert
              message={uploadingTemplate.id.startsWith('custom_') ? '编辑字段自动映射' : '配置字段自动映射'}
              description={`为模板 "${uploadingTemplate.name}" ${uploadingTemplate.id.startsWith('custom_') ? '修改' : '配置'}字段映射，以便系统自动填充合同内容。`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form
              layout="vertical"
              onFinish={(values) => {
                const isExistingTemplate = contractTemplates.some(t => t.id === uploadingTemplate.id);
                if (isExistingTemplate) {
                  // 编辑现有模板
                  const updatedTemplate = {
                    ...uploadingTemplate,
                    autoMapping: values as AutoFieldMapping,
                    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
                  };
                  
                  setContractTemplates(prev => 
                    prev.map(template => 
                      template.id === uploadingTemplate.id ? updatedTemplate : template
                    )
                  );
                  
                  if (selectedTemplate?.id === uploadingTemplate.id) {
                    setSelectedTemplate(updatedTemplate);
                  }
                  
                  message.success('模板配置已更新');
                } else {
                  // 新增模板
                  handleSaveCustomTemplate(values as AutoFieldMapping);
                }
                setFieldMappingModalVisible(false);
                setUploadingTemplate(null);
              }}
              initialValues={uploadingTemplate.autoMapping}
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab="甲方信息映射" key="1">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="企业名称变量"
                        name={['partyA', 'companyName']}
                        tooltip="在模板中对应甲方企业名称的变量名，如：{{partyACompany}}"
                      >
                        <Input placeholder="如：partyACompany" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="税号变量"
                        name={['partyA', 'taxNumber']}
                        tooltip="在模板中对应甲方税号的变量名"
                      >
                        <Input placeholder="如：partyATaxNumber" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="公司地址变量"
                        name={['partyA', 'companyAddress']}
                        tooltip="在模板中对应甲方地址的变量名"
                      >
                        <Input placeholder="如：partyAAddress" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="法定代表人变量"
                        name={['partyA', 'legalRepresentative']}
                        tooltip="在模板中对应甲方法定代表人的变量名"
                      >
                        <Input placeholder="如：partyALegal" />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab="乙方信息映射" key="2">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="企业名称变量"
                        name={['partyB', 'companyName']}
                      >
                        <Input placeholder="如：partyBCompany" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="税号变量"
                        name={['partyB', 'taxNumber']}
                      >
                        <Input placeholder="如：partyBTaxNumber" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="公司地址变量"
                        name={['partyB', 'companyAddress']}
                      >
                        <Input placeholder="如：partyBAddress" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="法定代表人变量"
                        name={['partyB', 'legalRepresentative']}
                      >
                        <Input placeholder="如：partyBLegal" />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab="项目信息映射" key="3">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="项目名称变量"
                        name={['project', 'name']}
                      >
                        <Input placeholder="如：projectName" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="项目位置变量"
                        name={['project', 'location']}
                      >
                        <Input placeholder="如：projectLocation" />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab="商务条款映射" key="4">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="租赁面积变量"
                        name={['businessTerms', 'leaseArea']}
                      >
                        <Input placeholder="如：leaseArea" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="租赁楼层变量"
                        name={['businessTerms', 'leaseFloor']}
                      >
                        <Input placeholder="如：leaseFloor" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="租赁单价变量"
                        name={['businessTerms', 'leasePrice']}
                      >
                        <Input placeholder="如：leasePrice" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="租赁年限变量"
                        name={['businessTerms', 'leaseTerm']}
                      >
                        <Input placeholder="如：leaseTerm" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="起租日期变量"
                        name={['businessTerms', 'startDate']}
                      >
                        <Input placeholder="如：startDate" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="结束日期变量"
                        name={['businessTerms', 'endDate']}
                      >
                        <Input placeholder="如：endDate" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="付款方式变量"
                        name={['businessTerms', 'paymentMethod']}
                      >
                        <Input placeholder="如：paymentMethod" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="物业费单价变量"
                        name={['businessTerms', 'propertyFeePrice']}
                      >
                        <Input placeholder="如：propertyFeePrice" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="月租金变量"
                        name={['businessTerms', 'monthlyRent']}
                      >
                        <Input placeholder="如：monthlyRent" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="保证金变量"
                        name={['businessTerms', 'depositAmount']}
                      >
                        <Input placeholder="如：depositAmount" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="免租期变量"
                        name={['businessTerms', 'freeRentPeriods']}
                      >
                        <Input placeholder="如：freeRentPeriods" />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab="检测到的变量" key="5">
                  <Alert
                    message="检测到的模板变量"
                    description="以下是从您上传的模板中自动检测到的变量，请确认这些变量的用途。"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <List
                    size="small"
                    dataSource={uploadingTemplate.variables}
                    renderItem={(variable: any) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`{{${variable.key}}}`}
                          description={`类型：${variable.type} | 必填：${variable.required ? '是' : '否'}`}
                        />
                        <Tag color={variable.autoExtract ? 'green' : 'default'}>
                          {variable.autoExtract ? '自动提取' : '手动填写'}
                        </Tag>
                      </List.Item>
                    )}
                  />
                </TabPane>
              </Tabs>

              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Space>
                  <Button 
                    onClick={() => {
                      setFieldMappingModalVisible(false);
                      setUploadingTemplate(null);
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SettingOutlined />}>
                    {contractTemplates.some(t => t.id === uploadingTemplate?.id) ? '更新配置' : '保存配置'}
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PotentialProjects; 