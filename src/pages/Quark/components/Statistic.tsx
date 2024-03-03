import React, {useEffect, useState} from "react";

import {Button, Statistic as AntdStatistic, StatisticProps} from 'antd';
import {ReloadOutlined, LoadingOutlined} from '@ant-design/icons';
import {request} from "@@/plugin-request/request";

export interface Props extends StatisticProps {
  load?: string;
}

const Statistic: React.FC<Props> = (props: Props) => {

  const {load, value, ..._props} = props;

  // 可更新的Value
  const [loadValue, setLoadValue] = useState({value});
  const [loading, setLoading] = useState(false);

  const loadFunc = async (url: string) => {
    setLoading(true);
    const result = await request(url);
    setLoadValue(result.data);
    setLoading(false);
  };
  useEffect(() => {
    if (load) {
      loadFunc(load).then();
    }
  }, [])
  return load ? <>
      <Button size={"small"} disabled={loading} onClick={() => {
        loadFunc(load).then();
      }} style={{position: 'absolute', right: '5px'}}>{loading ? <LoadingOutlined/> : <ReloadOutlined/>}</Button>
      <AntdStatistic {..._props} {...loadValue} loading={loading}></AntdStatistic>
    </> :
    <AntdStatistic {..._props} value={value}></AntdStatistic>;
}

export default Statistic;
