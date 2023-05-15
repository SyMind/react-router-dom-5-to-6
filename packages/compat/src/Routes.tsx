import React, { useContext, useMemo } from 'react'
import { UNSAFE_RouteContext as RouteContext, RoutesProps, Routes as V6Routes } from 'react-router-dom'

// https://github.com/remix-run/react-router/issues/8035#issuecomment-997737565
export const Routes: React.FC<RoutesProps> = props => {
  const ctx = useContext(RouteContext);
  
  const value = useMemo(
    () => ({
      ...ctx,
      matches: []
    }),
    [ctx]
  );

  return (
    <RouteContext.Provider
      value={value}
    >
      <V6Routes {...props}/>
    </RouteContext.Provider>
  )
}

