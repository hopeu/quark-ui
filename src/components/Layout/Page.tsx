import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { get } from '@/services/action';
import Render from '@/components/Render';
import { PageContainer } from '@ant-design/pro-layout';

const Page: React.FC<any> = (props:any) => {

  const [data, setDataState] = useState(null);

  useEffect(() => {
    if(props.initApi) {
      getData(props.initApi)
    }
  }, [props.initApi]);

  const getData = async (initApi:string) => {

    const result = await get({
      actionUrl: initApi,
      ...history.location.query
    });

    setDataState(result.data);
  };

  return (
    <PageContainer {...props}>
      <Render body={props.body} data={data} />
    </PageContainer>
  );
}

export default Page;