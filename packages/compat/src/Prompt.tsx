// Alternative for Prompt in React Router V6
// https://stackoverflow.com/questions/70178993/alternative-for-prompt-in-react-router-v6/75920683#75920683

import React from 'react'
import { unstable_useBlocker as useBlocker, useLocation } from 'react-router-dom'
import { Location, Action } from 'history'

export interface PromptProps {
  message: string | ((location: Location, action: Action) => string | boolean);
  when?: boolean | undefined;
}

export const Prompt: React.FC<PromptProps> = ({ message, when = true }) => {
  const locaton = useLocation()

  useBlocker(() => {
    if (when) {
      const result = typeof message === 'function' ? message(locaton, 'PUSH') : message
      if (typeof result === 'string') {
        return !window.confirm(result)
      }
      if (typeof result === 'boolean') {
        return result
      }
    }
    return false
  })
  
  return null;
}

export default Prompt
