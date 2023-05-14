import React from 'react'
import { Route as V6Route, RouteProps as V6RouteProps } from 'react-router-dom'
import type { RouteComponentProps } from '..'
import { withRouter } from './withRouter'

export type RouteProps<
  Path extends string = string,
  Params extends { [K: string]: string | undefined } = { [K: string]: string | undefined },
> = V6RouteProps & {
  render?: ((props: RouteComponentProps<Params>) => React.ReactNode) | undefined;
}

// Newer Omit type: as the previous one is being exported, removing it would be a breaking change
export type OmitNative<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P] };

export class Route<T extends {} = {}, Path extends string = string> extends React.Component<RouteProps<Path> & OmitNative<T, keyof RouteProps>> {
  render() {
    const { render, ...rest } = this.props

    if (render) {
      class WrappedComponent extends React.Component<RouteComponentProps> {
        render() {
          return render!(this.props)
        }
      }
      const Component = withRouter(WrappedComponent)

      return <V6Route {...rest} element={<Component />} />
    }

    return <V6Route {...rest} />
  }
}
