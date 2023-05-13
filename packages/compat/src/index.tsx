import React, { useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate, createPath } from 'react-router-dom'
import hoistStatics from 'hoist-non-react-statics'
import type { History, Location, LocationListener, LocationState } from 'history'

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
    const navigate = useNavigate()

    const cbs = useRef<LocationListener[]>([])

    useEffect(() => {
      for (const cb of cbs.current) {
        cb(location, 'PUSH')
      }
    }, [location]);

    const history = useMemo<History>(() => ({
      length: window.history.length,
      action: 'PUSH',
      location,
      push(location, state) {
        navigate(location, {
          state
        })
      },
      replace(location, state) {
        navigate(location, {
          replace: true,
          state
        })
      },
      go(n) {
        navigate(n)
      },
      goBack() {
        navigate(-1)
      },
      goForward() {
        navigate(1)
      },
      block(prompt) {
        // TODO
        return () => {}
      },
      listen(listener) {
        if (!cbs.current.includes(listener)) {
          cbs.current.push(listener)
        }
        return () => {
          cbs.current = cbs.current.filter(cb => cb !== listener)
        }
      },
      createHref(location) {
        return createPath(location)
      }
    }), [location, navigate])

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
