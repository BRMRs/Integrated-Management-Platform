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
      paymentMethod: '押二付六',
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
                  <Input placeholder="如：押二付六" />
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

            {/* 免租期 */}
            <Divider>免租期</Divider>
            <Form.List name={['businessTerms', 'freeRentPeriods']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ 
                      border: '1px solid #f0f0f0', 
                      borderRadius: '6px', 
                      padding: '16px', 
                      marginBottom: '12px',
                      backgroundColor: '#fafafa'
                    }}>
                      <Row gutter={16} align="top">
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            label="第几年"
                            name={[name, 'year']}
                            rules={[{ required: true, message: '请输入年份' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              placeholder="第几年"
                              style={{ width: '100%' }}
                              min={1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            label="免租天数"
                            name={[name, 'days']}
                            rules={[{ required: true, message: '请输入免租天数' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              placeholder="免租天数"
                              style={{ width: '100%' }}
                              addonAfter="天"
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', marginBottom: '4px' }}>
                              开始时间
                            </label>
                            <Form.Item
                              shouldUpdate={(prevValues: any, currentValues: any) => {
                                return prevValues.businessTerms?.startDate !== currentValues.businessTerms?.startDate ||
                                       prevValues.businessTerms?.freeRentPeriods?.[name]?.year !== currentValues.businessTerms?.freeRentPeriods?.[name]?.year ||
                                       prevValues.businessTerms?.freeRentPeriods?.[name]?.days !== currentValues.businessTerms?.freeRentPeriods?.[name]?.days;
                              }}
                              style={{ marginBottom: 0 }}
                            >
                              {() => {
                                const allFormData = editForm.getFieldsValue();
                                const startDate = allFormData.businessTerms?.startDate;
                                const currentYear = allFormData.businessTerms?.freeRentPeriods?.[name]?.year;
                                const currentDays = allFormData.businessTerms?.freeRentPeriods?.[name]?.days;
                                
                                let placeholder = "请选择开始时间";
                                let suggestedDate = '';
                                
                                if (startDate && currentYear) {
                                  try {
                                    const startDateStr = startDate.format ? startDate.format('YYYY-MM-DD') : startDate;
                                    const dates = calculateFreeRentDates(startDateStr, currentYear, currentDays || 0);
                                    suggestedDate = dates.calculatedStartDate;
                                    placeholder = `建议: ${suggestedDate}`;
                                  } catch (error) {
                                    console.error('计算日期出错:', error);
                                  }
                                }
                                
                                return (
                                  <div>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'startDate']}
                                      style={{ marginBottom: 0 }}
                                    >
                                      <DatePicker 
                                        style={{ width: '100%' }} 
                                        placeholder={placeholder}
                                      />
                                    </Form.Item>
                                    {suggestedDate && (
                                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                        建议: {suggestedDate}
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', marginBottom: '4px' }}>
                              结束时间
                            </label>
                            <Form.Item
                              shouldUpdate={(prevValues: any, currentValues: any) => {
                                return prevValues.businessTerms?.startDate !== currentValues.businessTerms?.startDate ||
                                       prevValues.businessTerms?.freeRentPeriods?.[name]?.year !== currentValues.businessTerms?.freeRentPeriods?.[name]?.year ||
                                       prevValues.businessTerms?.freeRentPeriods?.[name]?.days !== currentValues.businessTerms?.freeRentPeriods?.[name]?.days ||
                                       prevValues.businessTerms?.freeRentPeriods?.[name]?.startDate !== currentValues.businessTerms?.freeRentPeriods?.[name]?.startDate;
                              }}
                              style={{ marginBottom: 0 }}
                            >
                              {() => {
                                const allFormData = editForm.getFieldsValue();
                                const contractStartDate = allFormData.businessTerms?.startDate;
                                const year = allFormData.businessTerms?.freeRentPeriods?.[name]?.year;
                                const days = allFormData.businessTerms?.freeRentPeriods?.[name]?.days;
                                const customStartDate = allFormData.businessTerms?.freeRentPeriods?.[name]?.startDate;
                                
                                let calculatedEndDate = '';
                                if (contractStartDate && year && days) {
                                  try {
                                    const contractStartDateStr = contractStartDate.format ? contractStartDate.format('YYYY-MM-DD') : contractStartDate;
                                    const customStartDateStr = customStartDate ? (customStartDate.format ? customStartDate.format('YYYY-MM-DD') : customStartDate) : undefined;
                                    
                                    const dates = calculateFreeRentDates(
                                      contractStartDateStr, 
                                      year, 
                                      days, 
                                      customStartDateStr
                                    );
                                    calculatedEndDate = dates.calculatedEndDate;
                                  } catch (error) {
                                    console.error('计算结束日期出错:', error);
                                  }
                                }
                                
                                return (
                                  <div>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'endDate']}
                                      style={{ marginBottom: 0 }}
                                    >
                                      <DatePicker 
                                        style={{ width: '100%' }} 
                                        placeholder="自动计算"
                                        disabled
                                        value={calculatedEndDate ? dayjs(calculatedEndDate) : null}
                                      />
                                    </Form.Item>
                                    {calculatedEndDate && (
                                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                        自动计算: {calculatedEndDate}
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={4}>
                          <div style={{ paddingTop: '30px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                              <Form.Item
                                shouldUpdate={(prevValues: any, currentValues: any) => {
                                  return prevValues.businessTerms?.startDate !== currentValues.businessTerms?.startDate ||
                                         prevValues.businessTerms?.freeRentPeriods?.[name]?.year !== currentValues.businessTerms?.freeRentPeriods?.[name]?.year ||
                                         prevValues.businessTerms?.freeRentPeriods?.[name]?.days !== currentValues.businessTerms?.freeRentPeriods?.[name]?.days;
                                }}
                                style={{ marginBottom: 0 }}
                              >
                                {() => {
                                  const allFormData = editForm.getFieldsValue();
                                  const contractStartDate = allFormData.businessTerms?.startDate;
                                  const year = allFormData.businessTerms?.freeRentPeriods?.[name]?.year;
                                  const days = allFormData.businessTerms?.freeRentPeriods?.[name]?.days;
                                  
                                  const handleAutoFill = () => {
                                    if (contractStartDate && year && days) {
                                      try {
                                        const contractStartDateStr = contractStartDate.format ? contractStartDate.format('YYYY-MM-DD') : contractStartDate;
                                        const dates = calculateFreeRentDates(contractStartDateStr, year, days);
                                        
                                        // 直接设置该字段的值
                                        editForm.setFieldValue(['businessTerms', 'freeRentPeriods', name, 'startDate'], dayjs(dates.calculatedStartDate));
                                        // 强制刷新表单
                                        editForm.validateFields();
                                      } catch (error) {
                                        console.error('自动填充出错:', error);
                                      }
                                    }
                                  };
                                  
                                  return (
                                    <Button
                                      type="link"
                                      size="small"
                                      onClick={handleAutoFill}
                                      style={{ fontSize: '12px', padding: '0' }}
                                      disabled={!contractStartDate || !year || !days}
                                    >
                                      自动填充
                                    </Button>
                                  );
                                }}
                              </Form.Item>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(name)}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add({ year: fields.length + 1, days: 0 })} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      添加免租期
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
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
            </Row>
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
              ['businessTerms', 'freeRentPeriods']
            ]}>
              {({ getFieldsValue }) => {
                const formData = { businessTerms: getFieldsValue().businessTerms };
                const depositResult = calculateDepositAmount(formData);
                const paymentResult = calculateFirstPayment(formData);

                return (
                  <Row gutter={16}>
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
                );
              }}
            </Form.Item>
          </>
        );

      case '签订合同':
        return (
          <>
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
          </>
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
        freeRentPeriods: [] // 初始化空的免租期数组
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
    
    if (record.projectPhase === '市场调研' && record.marketResearch?.buildDate) {
      formValues.marketResearch = {
        ...record.marketResearch,
        buildDate: dayjs(record.marketResearch.buildDate)
      };
    }
    
    if (record.projectPhase === '商务条款' && record.businessTerms) {
      formValues.businessTerms = {
        ...record.businessTerms,
        startDate: record.businessTerms.startDate ? dayjs(record.businessTerms.startDate) : null,
        firstPaymentDate: record.businessTerms.firstPaymentDate ? dayjs(record.businessTerms.firstPaymentDate) : null,
        depositPaymentDate: record.businessTerms.depositPaymentDate ? dayjs(record.businessTerms.depositPaymentDate) : null,
        rentIncreases: record.businessTerms.rentIncreases?.map(increase => ({
          ...increase,
          increaseTime: dayjs(increase.increaseTime)
        })) || [],
        freeRentPeriods: record.businessTerms.freeRentPeriods?.map(period => ({
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
        
        // 处理免租期日期
        if (processedValues.businessTerms.freeRentPeriods) {
          processedValues.businessTerms.freeRentPeriods = processedValues.businessTerms.freeRentPeriods.map((period: any) => ({
            ...period,
            startDate: period.startDate ? period.startDate.format('YYYY-MM-DD') : null,
            endDate: period.endDate ? period.endDate.format('YYYY-MM-DD') : null
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
  const calculateFreeRentDates = (startDate: string, year: number, days: number, customStartDate?: string) => {
    if (!startDate) return { calculatedStartDate: '', calculatedEndDate: '' };
    
    const baseStartDate = dayjs(startDate);
    
    // 计算该年份的免租期开始日期
    let freeRentStartDate;
    if (customStartDate) {
      // 如果用户自定义了开始日期，使用自定义日期
      freeRentStartDate = dayjs(customStartDate);
    } else {
      // 否则使用计算得出的日期
      if (year === 1) {
        // 第一年从起租日开始
        freeRentStartDate = baseStartDate;
      } else {
        // 第N年从起租日的第N-1个周年开始
        freeRentStartDate = baseStartDate.add(year - 1, 'year');
      }
    }
    
    // 结束日期 = 开始日期 + 免租天数
    const freeRentEndDate = freeRentStartDate.add(days, 'day');
    
    return {
      calculatedStartDate: freeRentStartDate.format('YYYY-MM-DD'),
      calculatedEndDate: freeRentEndDate.format('YYYY-MM-DD')
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
      freeRentPeriods 
    } = formData.businessTerms;
    
    const { payment } = parsePaymentMethod(paymentMethod || '');
    
    if (!startDate || !payment) return { rentPayment: 0, propertyPayment: 0, totalPayment: 0, paymentDays: 0 };

    const startDateObj = dayjs(startDate);
    
    // 计算租金首期款开始日期（考虑第一年免租期）
    let rentPaymentStartDate = startDateObj;
    const firstYearFreeRent = freeRentPeriods?.find((period: any) => period.year === 1);
    if (firstYearFreeRent && firstYearFreeRent.days > 0) {
      // 使用免租期的实际结束日期作为租金开始计算日期
      const freeRentDates = calculateFreeRentDates(
        startDate, 
        1, 
        firstYearFreeRent.days, 
        firstYearFreeRent.startDate
      );
      rentPaymentStartDate = dayjs(freeRentDates.calculatedEndDate);
    }

    // 计算物业费首期款开始日期（物业费通常没有免租期）
    const propertyPaymentStartDate = startDateObj;

    // 首期款结束日期 = 开始日期 + 付几个月
    const rentPaymentEndDate = rentPaymentStartDate.add(payment, 'month');
    const propertyPaymentEndDate = propertyPaymentStartDate.add(payment, 'month');

    // 计算天数
    const rentPaymentDays = rentPaymentEndDate.diff(rentPaymentStartDate, 'day');
    const propertyPaymentDays = propertyPaymentEndDate.diff(propertyPaymentStartDate, 'day');

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

                {/* 根据阶段显示不同信息 */}
                {currentRecord.projectPhase === '前期洽谈' && currentRecord.earlyStage && (
                  <div>
                    <Title level={5}>前期洽谈信息</Title>
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text strong>联系人: </Text>
                        <Text>{currentRecord.earlyStage.contact}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>联系电话: </Text>
                        <Text>{currentRecord.earlyStage.contactPhone}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁面积: </Text>
                        <Text>{currentRecord.earlyStage.leaseArea?.toLocaleString()} ㎡</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁单价: </Text>
                        <Text>¥{currentRecord.earlyStage.leasePrice}/㎡/天</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>付款方式: </Text>
                        <Text>{currentRecord.earlyStage.paymentMethod}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>合作意向: </Text>
                        <Progress
                          percent={currentRecord.earlyStage.intentionLevel}
                          style={{ width: 150 }}
                        />
                      </Col>
                      {currentRecord.earlyStage.mainCompetitors && (
                        <Col span={24}>
                          <Text strong>主要竞争对手: </Text>
                          <Text>{currentRecord.earlyStage.mainCompetitors}</Text>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}

                {currentRecord.projectPhase === '市场调研' && currentRecord.marketResearch && (
                  <div>
                    <Title level={5}>市场调研信息</Title>
                    <Row gutter={[16, 8]}>
                      <Col span={24}>
                        <Text strong>运营类型: </Text>
                        {currentRecord.marketResearch.operationType?.map(type => (
                          <Tag key={type} color="blue" style={{ marginLeft: 8 }}>
                            {type}
                          </Tag>
                        ))}
                      </Col>
                      <Col span={24}>
                        <Text strong><EnvironmentOutlined /> 所在位置: </Text>
                        <Text>{currentRecord.marketResearch.location}</Text>
                      </Col>
                      <Col span={24}>
                        <Text strong>产权方信息: </Text>
                        <Text>{currentRecord.marketResearch.propertyOwnerInfo}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>楼宇标准: </Text>
                        <Text>{currentRecord.marketResearch.buildingStandard}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>是否独家: </Text>
                        <Text>{currentRecord.marketResearch.isExclusive ? '是' : '否'}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>市场价: </Text>
                        <Text>¥{currentRecord.marketResearch.marketPrice}/㎡/天</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>出租率: </Text>
                        <Text>{currentRecord.marketResearch.occupancyRate}%</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>是否孵化器: </Text>
                        <Text>{currentRecord.marketResearch.isIncubator ? '是' : '否'}</Text>
                      </Col>
                    </Row>
                  </div>
                )}

                {currentRecord.projectPhase === '商务条款' && currentRecord.businessTerms && (
                  <div>
                    <Title level={5}>商务条款信息</Title>
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text strong>联系人: </Text>
                        <Text>{currentRecord.businessTerms.contact}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>联系电话: </Text>
                        <Text>{currentRecord.businessTerms.contactPhone}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁面积: </Text>
                        <Text>{currentRecord.businessTerms.leaseArea?.toLocaleString()} ㎡</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁楼层: </Text>
                        <Text>{currentRecord.businessTerms.leaseFloor}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁单价: </Text>
                        <Text>¥{currentRecord.businessTerms.leasePrice}/㎡/天</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>租赁年限: </Text>
                        <Text>{currentRecord.businessTerms.leaseTerm} 年</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>物业费单价: </Text>
                        <Text>¥{currentRecord.businessTerms.propertyFeePrice}/㎡/月</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>合作意向: </Text>
                        <Progress
                          percent={currentRecord.businessTerms.intentionLevel}
                          style={{ width: 150 }}
                        />
                      </Col>
                    </Row>
                    
                    {currentRecord.businessTerms.rentIncreases && currentRecord.businessTerms.rentIncreases.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <Text strong>租金递增: </Text>
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
                        <Text strong>免租期: </Text>
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

                    {/* 自动计算结果展示 */}
                    <Divider style={{ margin: '16px 0' }}>自动计算结果</Divider>
                    {(() => {
                      const formData = { businessTerms: currentRecord.businessTerms };
                      const depositResult = calculateDepositAmount(formData);
                      const paymentResult = calculateFirstPayment(formData);

                      return (
                        <Row gutter={16}>
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
                      );
                    })()}
                  </div>
                )}

                {currentRecord.projectPhase === '签订合同' && currentRecord.contractSigned && (
                  <div>
                    <Title level={5}>合同信息</Title>
                    <Text strong>合同文件: </Text>
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
                )}

                {currentRecord.projectPhase === '已放弃' && currentRecord.abandoned && (
                  <div>
                    <Title level={5}>放弃原因</Title>
                    <Text>{currentRecord.abandoned.reason}</Text>
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