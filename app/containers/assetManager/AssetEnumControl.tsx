import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import * as React from 'react';

export namespace AssetEnumControl {
  export interface Props<T> {
    state: T;
    setState: (t: T) => void;
    items: { [key: string]: Item<T> }
  }

  export interface Item<T> {
    id: T;
    name: string;
    icon: IconName;
  }
}

function ItemInternal<T>({
  item,
  setState,
}: { item: AssetEnumControl.Item<T>, setState: (state: T) => void }) {
  const { name, icon, id } = item;
  const onClick = React.useCallback(() => {
    setState(id);
  }, [item, setState]);
  return (
    <MenuItem
      text={name}
      icon={icon}
      onClick={onClick}
    />
  );
}
const Item = React.memo(ItemInternal) as typeof ItemInternal;

function AssetEnumControlInternal<T extends string>({
  state, setState, items,
}: AssetEnumControl.Props<T>) {
  const { name, icon } = items[state];

  return (
    <Popover position={Position.BOTTOM}>
      <Button
        text={name}
        icon={icon}
      />
      <Menu>
        {Object.keys(items).map((orderId) => {
          const orderItem = items[orderId];
          return <Item<T> key={orderId} item={orderItem} setState={setState} />;
        })}
      </Menu>
    </Popover>
  );
};
export const AssetEnumControl = React.memo(AssetEnumControlInternal) as typeof AssetEnumControlInternal;
