import React from 'react'
import { NavLink as BaseNavLink, NavLinkProps as BaseNavLinkProps } from 'react-router-dom'

export interface NavLinkProps extends BaseNavLinkProps {
  activeClassName?: string | undefined;
  activeStyle?: React.CSSProperties | undefined;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ activeClassName, activeStyle, ...props }, ref) => (
    <BaseNavLink
      ref={ref}
      {...props}
      className={({ isActive }) =>
        [
          props.className,
          isActive ? activeClassName : null,
        ]
          .filter(Boolean)
          .join(' ')
      }
      style={({ isActive }) => ({
        ...props.style,
        ...(isActive ? activeStyle : null),
      })}
    />
  )
)
