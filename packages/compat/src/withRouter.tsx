import React from 'react'
import { useLocation } from 'react-router-dom'
import hoistStatics from 'hoist-non-react-statics'
import type { History, Location, LocationState } from 'history'
import { useHistory } from './useHistory'

export interface StaticContext {
  statusCode?: number | undefined;
}

export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = LocationState,
> {
  history: History;
  location: Location;
  // match: match<Params>;
  // staticContext?: C | undefined;
}

export const withRouter = <P extends RouteComponentProps<any>, C extends React.ComponentType<P>>(Component: C & React.ComponentType<P>) => {
  const displayName = `withRouter(${Component.displayName || Component.name})`;

  const C: any = ({ wrappedComponentRef, ...remainingProps }: any) => {
    const location = useLocation()
    const history = useHistory()

    return (
      <Component
        {...remainingProps}
        ref={wrappedComponentRef}
        location={location}
        history={history}
      />
    )
  }

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
}
