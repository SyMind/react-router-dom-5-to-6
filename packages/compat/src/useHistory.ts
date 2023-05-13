import { useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate, createPath } from 'react-router-dom'
import type { History, LocationListener, LocationState } from 'history'

export function useHistory<HistoryLocationState = LocationState>(): History<HistoryLocationState> {
  const location = useLocation()
  const navigate = useNavigate()

  const cbs = useRef<LocationListener<HistoryLocationState>[]>([])

  useEffect(() => {
    for (const cb of cbs.current) {
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

  return history
}
