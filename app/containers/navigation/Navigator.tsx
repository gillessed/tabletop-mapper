import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/rootReducer';
import { Navigation } from '../../redux/navigation/types';

interface OwnProps {
    name: string;
}

interface StateProps {
    navigation: Navigation;
}

type Props = OwnProps & StateProps;

class NavigatorInternal extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const navigationState = this.props.navigation.routes[this.props.name];
        if (!navigator) {
            return <div>Undefined navigator: {this.props.name}</div>;
        }
        const navigatorRoute = navigationState.routeStack[navigationState.index].route;
        const navigatorParams = navigationState.routeStack[navigationState.index].params;
        const children = React.Children.toArray(this.props.children)
            .filter((child: React.ReactChild) => {
                if (typeof child === 'string') {
                    return false;
                }
                const cast = child as React.ReactElement<any>;
                return cast.props.route === navigatorRoute;
            });
        if (children.length === 0) {
            return <div>Navigator {this.props.name} has no children with route {navigatorRoute}.</div>;
        } else if (children.length >= 2) {
            return <div>Navigator {this.props.name} has multiple children with route {navigatorRoute}.</div>;
        } else {
            return React.cloneElement(children[0] as React.ReactElement<any>, { params: navigatorParams });
        }
    }
}

const mapStateToProps = (state: ReduxState, ownProps: OwnProps) => {
    return {
        name: ownProps.name,
        navigation: state.navigation,
    };
};

export const Navigator = connect(mapStateToProps)(NavigatorInternal);