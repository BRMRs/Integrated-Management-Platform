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
  MinusCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DetailedPotentialProject, PotentialProjectFilters, ProjectFollowUpRecord, RentIncrease, FreeRentPeriod, ContractFile } from '../types';
import { useAuth } from '../store';
import dayjs from 'dayjs';

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
      isIncubator: false
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
  const [currentRecord, setCurrentRecord] = useState<DetailedPotentialProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('前期洽谈');

  // 项目阶段选项
  const phaseOptions = [
    { label: '前期洽谈', value: '前期洽谈', color: '#722ed1' },
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
      case '前期洽谈':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="联系人"
                  name={['earlyStage', 'contact']}
                  rules={[{ required: true, message: '请输入联系人' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="联系电话"
                  name={['earlyStage', 'contactPhone']}
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="租赁面积"
                  name={['earlyStage', 'leaseArea']}
                  rules={[{ required: true, message: '请输入租赁面积' }]}
                >
                  <InputNumber
                    placeholder="请输入租赁面积"
                    style={{ width: '100%' }}
                    addonAfter="㎡"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="租赁单价"
                  name={['earlyStage', 'leasePrice']}
                  rules={[{ required: true, message: '请输入租赁单价' }]}
                >
                  <InputNumber
                    placeholder="请输入租赁单价"
                    style={{ width: '100%' }}
                    addonAfter="元/㎡/天"
                    min={0}
                    step={0.1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="付款方式"
                  name={['earlyStage', 'paymentMethod']}
                  rules={[{ required: true, message: '请输入付款方式' }]}
                >
                  <Input placeholder="如：押二付六" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="合作意向程度"
                  name={['earlyStage', 'intentionLevel']}
                  initialValue={20}
                >
                  <div>
                    <Text strong style={{ color: '#1890ff' }}>20%</Text>
                    <Text style={{ marginLeft: 8, color: '#666' }}>（前期洽谈阶段自动设置）</Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="主要竞争对手"
              name={['earlyStage', 'mainCompetitors']}
            >
              <TextArea placeholder="请输入主要竞争对手信息" rows={3} />
            </Form.Item>
          </>
        );

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
            <Form.Item
              label="是否孵化器"
              name={['marketResearch', 'isIncubator']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
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
                  <Card size="small" title="甲方信息" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="企业单位"
                          name={['contractSigned', 'partyA', 'companyName']}
                          rules={[{ required: true, message: '请输入甲方企业单位' }]}
                        >
                          <Input placeholder="请输入甲方企业单位名称" />
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
      width: 160,
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
    setCurrentPhase('前期洽谈');
    // 设置默认值
    editForm.setFieldsValue({
      projectPhase: '前期洽谈',
      priority: 'P1',
      followUpBy: user?.name || '张三',
      nextFollowUpTime: dayjs().add(1, 'day'),
      earlyStage: {
        intentionLevel: 20
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
    
    // 处理市场调研阶段的日期字段
    if (record.projectPhase === '市场调研' && record.marketResearch) {
      formValues.marketResearch = {
        ...record.marketResearch,
        buildDate: record.marketResearch.buildDate ? dayjs(record.marketResearch.buildDate) : null
      };
    }
    
    // 处理商务条款阶段的日期字段
    if (record.projectPhase === '商务条款' && record.businessTerms) {
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
      if (processedValues.earlyStage) {
        processedValues.earlyStage.intentionLevel = intentionLevel;
      }
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

      const newRecord: DetailedPotentialProject = {
        id: isEditing ? currentRecord!.id : `${Date.now()}`,
        ...processedValues,
        followUpRecords: isEditing ? currentRecord!.followUpRecords : [],
        lastFollowUpTime: processedValues.nextFollowUpTime || now,
        lastFollowUpBy: processedValues.followUpBy || user?.name || '',
        createdBy: isEditing ? currentRecord!.createdBy : user?.name || '',
        createdAt: isEditing ? currentRecord!.createdAt : now,
        updatedAt: now
      };

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
      setCurrentPhase('前期洽谈');
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

  // 自动设置合作意向程度
  const getIntentionLevelByPhase = (phase: string): number => {
    switch (phase) {
      case '前期洽谈': return 20;
      case '市场调研': return 50;
      case '商务条款': return 80;
      case '签订合同': return 100;
      case '已放弃': return 0;
      default: return 20;
    }
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

                {/* 前期洽谈阶段 */}
                {currentRecord.earlyStage && (
                  <div style={{ marginBottom: 24 }}>
                    <Card 
                      size="small" 
                      title="前期洽谈" 
                      headStyle={{ 
                        backgroundColor: currentRecord.projectPhase === '前期洽谈' ? '#e6f7ff' : '#f5f5f5',
                        fontWeight: currentRecord.projectPhase === '前期洽谈' ? 'bold' : 'normal'
                      }}
                    >
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <Text strong>联系人：</Text>
                          <Text>{currentRecord.earlyStage.contact}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>联系电话：</Text>
                          <Text>{currentRecord.earlyStage.contactPhone}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>租赁面积：</Text>
                          <Text>{currentRecord.earlyStage.leaseArea?.toLocaleString()} ㎡</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>租赁单价：</Text>
                          <Text>¥{currentRecord.earlyStage.leasePrice}/㎡/天</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>付款方式：</Text>
                          <Text>{currentRecord.earlyStage.paymentMethod}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong>合作意向：</Text>
                          <Progress
                            percent={currentRecord.earlyStage.intentionLevel}
                            style={{ width: 150 }}
                          />
                        </Col>
                        {currentRecord.earlyStage.mainCompetitors && (
                          <Col span={24}>
                            <Text strong>主要竞争对手：</Text>
                            <Text style={{ marginLeft: 8 }}>{currentRecord.earlyStage.mainCompetitors}</Text>
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
    </div>
  );
};

export default PotentialProjects; 