import * as React from "react";
import classNames from "classnames";
import { Model } from "../../../redux/model/ModelTypes";
import { useSelector } from "react-redux";
import { Select, IItemRendererProps } from "@blueprintjs/select";
import { Button, MenuItem, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { stringSearch } from "../../../utils/stringSearch";
import { useDispatchers } from '../../../DispatcherContextProvider';

export namespace StyleSelect {
  export interface Props {
    selectedStyle: Model.Types.Style;
    styleFilter?: (styles: Model.Types.Style) => boolean;
    editingFeatureId?: string;
  }
}

const MaxStyleCount = 10;

function styleListPredicate(query: string, styles: Model.Types.Style[]): Model.Types.Style[] {
  if (query.length === 0) {
    return styles;
  }
  const queryLowerCase = query.toLocaleLowerCase();
  const matchedStyles: Model.Types.Style[] = styles
    .map((style) => {
      const match = stringSearch(queryLowerCase, style.name.toLocaleLowerCase());
      return match ? {
        ...style,
        match,
      } : undefined;
    })
    .filter((style) => !!style)
    .sort((s1, s2) => {
      return s2.name.localeCompare(s1.name);
    })
    .slice(0, MaxStyleCount);
  return matchedStyles;
}

function styleRenderer(style: Model.Types.Style, { handleClick, modifiers, query }: IItemRendererProps) {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${style.name}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={style.type}
      key={style.id}
      onClick={handleClick}
      text={text}
    />
  );
}

const NoResultsItem = <MenuItem disabled={true} text="No styles found." />;

export const StyleSelect = React.memo(function StyleSelect({
  selectedStyle, styleFilter, editingFeatureId
}: StyleSelect.Props) {
  const styleIndex = useSelector(Model.Selectors.getStyles);
  const dispatchers = useDispatchers();
  const styles = React.useMemo(() => {
    return styleIndex.all
      .map((styleId) => styleIndex.byId[styleId])
      .filter((style) => {
        if (!styleFilter) {
          return true;
        }
        return styleFilter(style);
      });
  }, [styleIndex, styleFilter]);
  const onStyleSelected = React.useCallback((style: Model.Types.Style) => {
    dispatchers.model.setFeatureStyle({
      featureIds: [editingFeatureId],
      styleId: style.id,
    })
  }, [dispatchers, editingFeatureId]);
  const classes = classNames('style-select', Classes.FILL);
  return (
    <Select<Model.Types.Style>
      className={classes}
      items={styles}
      itemListPredicate={styleListPredicate}
      itemRenderer={styleRenderer}
      noResults={NoResultsItem}
      onItemSelect={onStyleSelected}
    >
      <Button text={selectedStyle.name} rightIcon={IconNames.CARET_DOWN} className={Classes.FILL} />
    </Select>
  );
});
