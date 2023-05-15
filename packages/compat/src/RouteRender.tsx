import React from 'react'
import type { RouteComponentProps } from '..'
import { withRouter } from './withRouter'

interface RouteRenderProps {
  render: ((props: RouteComponentProps<{ [K: string]: string | undefined }>) => React.ReactNode) | undefined;
}

export const RouteRender: React.FC<RouteRenderProps> = ({ render }) => {
  class WrappedComponent extends React.Component<RouteComponentProps> {
    render() {
      return render!(this.props);
    }
  }
  const Component = withRouter(WrappedComponent)

  return <Component />
}
