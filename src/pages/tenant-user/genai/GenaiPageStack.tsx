import type { ReactNode } from 'react'
import { Flex } from '@patternfly/react-core'

type GenaiPageStackProps = {
  children: ReactNode
  className?: string
  id?: string
}

/**
 * Shared column stack with PatternFly md gap — use for toolbar + table (and similar)
 * blocks under GenAI / AI page chrome, including inside tab panels.
 */
export function GenaiPageStack({ children, className, id }: GenaiPageStackProps) {
  return (
    <Flex
      id={id}
      direction={{ default: 'column' }}
      gap={{ default: 'gapMd' }}
      className={['tenant-genai-page__stack', className].filter(Boolean).join(' ')}
    >
      {children}
    </Flex>
  )
}
