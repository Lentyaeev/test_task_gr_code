import { type ReactNode, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  to: string
  className?: string
  children: ReactNode
  'aria-label'?: string
}

export function TransitionLink(props: Props) {
  const navigate = useNavigate()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const go = () => navigate(props.to)
      const vt = document.startViewTransition
      if (vt) vt(go)
      else go()
    },
    [navigate, props.to],
  )

  return (
    <a href={props.to} className={props.className} onClick={onClick} aria-label={props['aria-label']}>
      {props.children}
    </a>
  )
}

