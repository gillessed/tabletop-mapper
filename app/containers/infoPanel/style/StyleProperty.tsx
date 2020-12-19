import * as React from "react";
import { Model } from "../../../redux/model/ModelTypes";

export namespace StyleProperty {
  export interface Props extends React.PropsWithChildren<any> {
    name: string | JSX.Element; 
  }
}

export const StyleProperty = React.memo(function StyleProperty({
  name, children,
}: StyleProperty.Props) {
  return (
    <>
      <div className='style-property'>
        {typeof name === 'string' && <div className='label style-label'>{name}</div>}
        {typeof name !== 'string' && {name}}
        <div className='style-row'>
          {children}
        </div>
      </div>
    </>
  );
});
