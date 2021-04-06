import React from 'react';
import Render from '@/components/Render';

const Container: React.FC<any> = (props:any) => {
  return (
    <div style={props?.style}>
      <Render body={props.body} />
    </div>
  );
}

export default Container;