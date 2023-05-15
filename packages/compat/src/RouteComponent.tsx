import React, { createElement } from 'react'
import { useHistory } from './useHistory'

interface RouteComponentProps<T = any> {
  component: React.ComponentType<T>;
}

export const RouteComponent: React.FC<RouteComponentProps> = ({ component }) => {
  const history = useHistory()
  return createElement(component, history)
}
