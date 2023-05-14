import React, { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import hoistStatics from 'hoist-non-react-statics'
import type { History, Location, LocationState } from 'history'
import { useHistory } from './useHistory'

export interface StaticContext {
  statusCode?: number | undefined;
}

export interface match<Params extends { [K in keyof Params]?: string } = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = LocationState,
> {
  history: History<S>;
  location: Location<S>;
  match: match<Params>;
  staticContext?: C | undefined;
}

export const withRouter = <P extends RouteComponentProps<any>, C extends React.ComponentType<P>>(Component: C & React.ComponentType<P>) => {
  const displayName = `withRouter(${Component.displayName || Component.name})`;

  const C: any = ({ wrappedComponentRef, ...remainingProps }: any) => {
    const location = useLocation()
    const history = useHistory()
    const params = useParams()

    const match = useMemo(() => ({
      params,
      // TODO
      isExact: false,
      path: '',
      url: '',
    }), [params])

    return (
      <Component
        {...remainingProps}
        ref={wrappedComponentRef}
        location={location}
        history={history}
        match={match}
      />
    )
  }

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
}
