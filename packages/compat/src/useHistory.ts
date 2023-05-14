import { useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate, createPath, unstable_useBlocker as useBlocker } from 'react-router-dom'
import type { History, LocationListener, LocationState, TransitionPromptHook } from 'history'

export function useHistory<HistoryLocationState = LocationState>(): History<HistoryLocationState> {
  const location = useLocation()
  const navigate = useNavigate()

  const promptRef = useRef<string | boolean | TransitionPromptHook<HistoryLocationState> | undefined>()

  // TODO: useBlocker must be used within a data router.
  // useBlocker(() => {
  //   const result = typeof promptRef.current === 'function' ? promptRef.current(location, 'PUSH') : promptRef.current
  //   if (typeof result === 'string') {
  //     return !window.confirm(result)
  //   }
  //   if (typeof result === 'boolean') {
  //     return result
  //   }
  //   return false
  // })

  const listenCbs = useRef<LocationListener<HistoryLocationState>[]>([])

  useEffect(() => {
    for (const cb of listenCbs.current) {
      cb(location, 'PUSH')
    }
  }, [location]);

  const history = useMemo<History<HistoryLocationState>>(() => ({
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
      promptRef.current = prompt
      return () => {
        promptRef.current = undefined
      }
    },
    listen(listener) {
      if (!listenCbs.current.includes(listener)) {
        listenCbs.current.push(listener)
      }
      return () => {
        listenCbs.current = listenCbs.current.filter(cb => cb !== listener)
      }
    },
    createHref(location) {
      return createPath(location)
    }
  }), [location, navigate])

  return history
}
