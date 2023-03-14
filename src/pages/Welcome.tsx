import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, message} from 'antd';
import {StatisticCard} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {monitorHomeCountQuery} from "@/services/ant-design-pro/monitor.home";

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

const homeCountQuery = async() => {
  const hide = message.loading('正在查询中');
  try {
    const resp = await monitorHomeCountQuery();
    hide();
    message.success('查询成功');
    return resp;
  } catch (error) {
    hide();
    message.error('查询失败!');
    return null;
  }
}

export default (): React.ReactNode => {
  const [responsive, setResponsive] = useState(false);
  const [response, setResponse] = useState<API.MonitorTaskHomeCountResponse>({
    dashboardCount: 0,
    databaseCount: 0,
    eventCount: 0,
    taskCount: 0
  });
  useEffect(() => {

    homeCountQuery().then((resp) => {
      // @ts-ignore
      setResponse(resp.data);
    });
  }, []);
    return (
    <PageContainer>
      <Card>
        <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 596);
          }}
        >
          <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
            <StatisticCard
              statistic={{
                title: '数据源数',
                value: response.databaseCount,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: '总任务量',
                value: response.taskCount,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: '总面板数',
                value: response.dashboardCount,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: '总事件数',
                value: response.eventCount,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
          </StatisticCard.Group>
        </RcResizeObserver>
      </Card>
    </PageContainer>
  );
};
