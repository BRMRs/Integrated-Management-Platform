import React from 'react';
import { Card, Statistic } from 'antd';
import { StatisticProps } from 'antd/es/statistic/Statistic';

interface StatisticCardProps extends StatisticProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
  precision?: number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  valueStyle,
  precision,
  ...restProps
}) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={valueStyle}
        precision={precision}
        {...restProps}
      />
    </Card>
  );
};

export default StatisticCard; 