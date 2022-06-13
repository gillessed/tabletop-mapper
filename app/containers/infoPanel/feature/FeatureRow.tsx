import * as React from "react";
import "./FeatureRow.scss";

export interface FeatureRowProps {
  name: string;
  children: React.ReactElement;
}

export const FeatureRow = React.memo(({
  name,
  children,
}: FeatureRowProps) => {
  return (
    <div className='feature-property' key={name}>
      <div className='feature-name label'>{name}</div>
      <div className='feature-row'>
        {children}
      </div>
    </div>
  );
});