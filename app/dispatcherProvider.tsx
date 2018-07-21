import * as React from 'react';
import { Store } from 'redux';
import { ReduxState } from './redux/rootReducer';
import { Dispatchers } from './redux/dispatchers';
import * as PropTypes from 'prop-types';

interface Props {
  dispatchers: (store: Store<ReduxState>) => Dispatchers;
}

export const DispatchersContextType: React.ValidationMap<any> = {
  dispatchers: PropTypes.object.isRequired,
};

export interface DispatchContext {
  dispatchers: Dispatchers;
}

export class DispatcherProvider extends React.Component<Props, {}> {
  private dispatcherGenerator: (store: Store<ReduxState>) => Dispatchers;
  private store: Store<ReduxState>;

  constructor(props: Props, context: any) {
    super(props, context);
    this.dispatcherGenerator = props.dispatchers;
    this.store = this.context.store;
  }

  render() {
    return React.Children.only(this.props.children);
  }

  getChildContext(): DispatchContext {
    return { dispatchers: this.dispatcherGenerator(this.store) };
  }

  public static childContextTypes = DispatchersContextType;
  public static contextTypes = { store: PropTypes.object.isRequired };
}