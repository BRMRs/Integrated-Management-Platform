import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Descriptions,
  Divider,
  Typography,
  Alert,
  List
} from 'antd';
import {
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SignedProject } from '../types';
import { useAppStore } from '../store';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SignedProjects: React.FC = () => {
  const { signedProjects } = useAppStore();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SignedProject | null>(null);

  // 查看详情
  const handleViewDetail = (record: SignedProject) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<SignedProject> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: SignedProject) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record)}
          style={{ padding: 0, textAlign: 'left' }}
        >
          {text}
        </Button>
      )
    },
    {
      title: '合同编号',
      dataIndex: 'contractWithLandlord',
      key: 'contractWithLandlord',
      width: 160
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text || '待更新'}
        </Space>
      )
    },
    {
      title: '面积',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 100,
      render: (area: number) => `${area} ㎡`
    },
    {
      title: '业主',
      dataIndex: 'landlord',
      key: 'landlord',
      width: 120
    },
    {
      title: '签约租金总额',
      key: 'totalRentAmount',
      width: 140,
      render: (_, record: SignedProject) => {
        const amount = record.contractAmounts?.totalRentAmount || record.rentToLandlord;
        return `¥${amount.toLocaleString()}`;
      }
    },
    {
      title: '物业费总额',
      key: 'totalPropertyFeeAmount',
      width: 140,
      render: (_, record: SignedProject) => {
        const amount = record.contractAmounts?.totalPropertyFeeAmount || 0;
        return `¥${amount.toLocaleString()}`;
      }
    },
    {
      title: '合同总金额',
      key: 'totalContractAmount',
      width: 140,
      render: (_, record: SignedProject) => {
        const amount = record.contractAmounts?.totalContractAmount || record.rentToLandlord;
        return <span style={{ fontWeight: 'bold', color: '#1890ff' }}>¥{amount.toLocaleString()}</span>;
      }
    },
    {
      title: '合同期限',
      key: 'contractPeriod',
      width: 180,
      render: (_, record: SignedProject) => (
        <div>
          <div>{dayjs(record.contractStartDate).format('YYYY-MM-DD')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            至 {dayjs(record.contractEndDate).format('YYYY-MM-DD')}
          </div>
        </div>
      )
    },

    {
      title: '项目经理',
      dataIndex: 'manager',
      key: 'manager',
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
      width: 80,
      fixed: 'right',
      render: (_, record: SignedProject) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>已签约项目管理</Title>
          <Text type="secondary">共 {signedProjects.length} 个项目</Text>
        </div>
        
        {signedProjects.length === 0 ? (
          <Alert
            message="暂无已签约项目"
            description="当潜在项目池中的项目完成签约后，将自动出现在这里"
            type="info"
            showIcon
            style={{ margin: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={signedProjects}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        )}
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="已签约项目详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="项目名称">{currentRecord.name}</Descriptions.Item>
              <Descriptions.Item label="合同编号">{currentRecord.contractWithLandlord}</Descriptions.Item>
              <Descriptions.Item label="项目位置">{currentRecord.location || '待更新'}</Descriptions.Item>
              <Descriptions.Item label="租赁面积">{currentRecord.totalArea} ㎡</Descriptions.Item>
              <Descriptions.Item label="业主">{currentRecord.landlord}</Descriptions.Item>
              <Descriptions.Item label="业主联系方式">{currentRecord.landlordContact || '待更新'}</Descriptions.Item>
              <Descriptions.Item label="项目经理">{currentRecord.manager}</Descriptions.Item>
              <Descriptions.Item label="合同开始日期">{dayjs(currentRecord.contractStartDate).format('YYYY-MM-DD')}</Descriptions.Item>
              <Descriptions.Item label="合同结束日期">{dayjs(currentRecord.contractEndDate).format('YYYY-MM-DD')}</Descriptions.Item>
              <Descriptions.Item label="签约租金总额">
                <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                  ¥{(currentRecord.contractAmounts?.totalRentAmount || currentRecord.rentToLandlord).toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="物业费总额">
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  ¥{(currentRecord.contractAmounts?.totalPropertyFeeAmount || 0).toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="合同总金额">
                <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '16px' }}>
                  ¥{(currentRecord.contractAmounts?.totalContractAmount || currentRecord.rentToLandlord).toLocaleString()}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {/* 合同金额明细 */}
            {currentRecord.contractAmounts?.yearlyBreakdown && currentRecord.contractAmounts.yearlyBreakdown.length > 0 && (
              <>
                <Divider>合同金额明细</Divider>
                <List
                  size="small"
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>年度明细（已考虑免租期和递增）</span>
                      <span>
                        租金：¥{(currentRecord.contractAmounts.totalRentAmount).toLocaleString()} | 
                        物业费：¥{(currentRecord.contractAmounts.totalPropertyFeeAmount).toLocaleString()} | 
                        总计：¥{(currentRecord.contractAmounts.totalContractAmount).toLocaleString()}
                      </span>
                    </div>
                  }
                  bordered
                  dataSource={currentRecord.contractAmounts.yearlyBreakdown}
                  renderItem={(item, index) => (
                    <List.Item>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <Text strong>第{item.year}年</Text>
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            ({item.dateRange})
                          </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div>
                            <Text>总天数：{item.yearDays}天</Text>
                            {item.freeRentDays > 0 && (
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                免租：{item.freeRentDays}天
                              </Text>
                            )}
                            <Text style={{ marginLeft: 8 }}>
                              计费：{item.chargingDays}天
                            </Text>
                          </div>
                          <div>
                            <Text type="secondary">单价：¥{item.rentPrice}/㎡/天</Text>
                            <Text strong style={{ marginLeft: 16, color: '#1890ff' }}>
                              年租金：¥{item.yearRent.toLocaleString()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* 商务条款详情 */}
            {(currentRecord.leasePrice || currentRecord.leaseTerm) && (
              <>
                <Divider>商务条款</Divider>
                <Descriptions bordered column={2}>
                  {currentRecord.leaseFloor && (
                    <Descriptions.Item label="租赁楼层">{currentRecord.leaseFloor}</Descriptions.Item>
                  )}
                  {currentRecord.leasePrice && (
                    <Descriptions.Item label="租赁单价">{currentRecord.leasePrice} 元/㎡/天</Descriptions.Item>
                  )}
                  {currentRecord.leaseTerm && (
                    <Descriptions.Item label="租赁期限">{currentRecord.leaseTerm} 年</Descriptions.Item>
                  )}
                  {currentRecord.paymentMethod && (
                    <Descriptions.Item label="付款方式">{currentRecord.paymentMethod}</Descriptions.Item>
                  )}
                  {currentRecord.firstPaymentDate && (
                    <Descriptions.Item label="首款支付日期">
                      {dayjs(currentRecord.firstPaymentDate).format('YYYY-MM-DD')}
                    </Descriptions.Item>
                  )}
                  {currentRecord.depositPaymentDate && (
                    <Descriptions.Item label="保证金支付日期">
                      {dayjs(currentRecord.depositPaymentDate).format('YYYY-MM-DD')}
                    </Descriptions.Item>
                  )}
                  {currentRecord.propertyFeePrice && (
                    <Descriptions.Item label="物业费单价">{currentRecord.propertyFeePrice} 元/㎡/月</Descriptions.Item>
                  )}
                  {currentRecord.propertyFeeCalculationMethod && (
                    <Descriptions.Item label="物业费计费方式">
                      {currentRecord.propertyFeeCalculationMethod === 'independent' ? '独立计费' : '与租金同步'}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}

            {/* 免租期信息 */}
            {currentRecord.freeRentPeriods && currentRecord.freeRentPeriods.length > 0 && (
              <>
                <Divider>租金免租期</Divider>
                <List
                  size="small"
                  dataSource={currentRecord.freeRentPeriods}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text>第{item.year}年：{item.days}天免租期</Text>
                      {item.startDate && item.endDate && (
                        <Text type="secondary">
                          （{dayjs(item.startDate).format('YYYY-MM-DD')} ~ {dayjs(item.endDate).format('YYYY-MM-DD')}）
                        </Text>
                      )}
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* 物业费免租期信息 */}
            {currentRecord.propertyFeeFreeRentPeriods && currentRecord.propertyFeeFreeRentPeriods.length > 0 && (
              <>
                <Divider>物业费免租期</Divider>
                <List
                  size="small"
                  dataSource={currentRecord.propertyFeeFreeRentPeriods}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text>第{item.year}年：{item.days}天免租期</Text>
                      {item.startDate && item.endDate && (
                        <Text type="secondary">
                          （{dayjs(item.startDate).format('YYYY-MM-DD')} ~ {dayjs(item.endDate).format('YYYY-MM-DD')}）
                        </Text>
                      )}
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* 合同双方信息 */}
            {(currentRecord.partyA || currentRecord.partyB) && (
              <>
                <Divider>合同双方</Divider>
                {currentRecord.partyA && (
                  <Descriptions title="甲方信息" bordered column={2} style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="企业单位">{currentRecord.partyA.companyName}</Descriptions.Item>
                    <Descriptions.Item label="税号">{currentRecord.partyA.taxNumber}</Descriptions.Item>
                    <Descriptions.Item label="公司地址" span={2}>{currentRecord.partyA.companyAddress}</Descriptions.Item>
                    <Descriptions.Item label="法定代表人">{currentRecord.partyA.legalRepresentative}</Descriptions.Item>
                  </Descriptions>
                )}
                {currentRecord.partyB && (
                  <Descriptions title="乙方信息" bordered column={2}>
                    <Descriptions.Item label="企业单位">{currentRecord.partyB.companyName}</Descriptions.Item>
                    <Descriptions.Item label="税号">{currentRecord.partyB.taxNumber}</Descriptions.Item>
                    <Descriptions.Item label="公司地址" span={2}>{currentRecord.partyB.companyAddress}</Descriptions.Item>
                    <Descriptions.Item label="法定代表人">{currentRecord.partyB.legalRepresentative}</Descriptions.Item>
                  </Descriptions>
                )}
              </>
            )}

            {/* 合同文件 */}
            {currentRecord.contractFiles && currentRecord.contractFiles.length > 0 && (
              <>
                <Divider>合同文件</Divider>
                <List
                  dataSource={currentRecord.contractFiles}
                  renderItem={(file) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: 16, color: '#1890ff' }} />}
                        title={file.name}
                        description={`上传时间：${dayjs(file.uploadTime).format('YYYY-MM-DD HH:mm:ss')} | 文件大小：${(file.fileSize / 1024 / 1024).toFixed(2)}MB`}
                      />
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* 来源信息 */}
            {currentRecord.potentialProjectId && (
              <>
                <Divider>转换信息</Divider>
                <Alert
                  message="项目来源"
                  description={`此项目由潜在项目池中的项目（ID: ${currentRecord.potentialProjectId}）签约转换而来`}
                  type="info"
                  showIcon
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SignedProjects; 