import type { FormProps } from '@patternfly/react-core'
import { Form } from '@patternfly/react-core'

/** Stand-in for osac-ux OsacForm — plain PatternFly Form. */
export function OsacForm({ isResponsive: _isResponsive, ...props }: FormProps & { isResponsive?: boolean }) {
  return <Form {...props} />
}

export default OsacForm
