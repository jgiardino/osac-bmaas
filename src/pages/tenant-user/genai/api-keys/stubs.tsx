/**
 * Minimal stand-ins for RHOAI prototype utilities used by APIKeysV34 / subscriptions.
 */
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'

export type ApiKeysSurface = 'tenant-user' | 'tenant-admin'

const ApiKeysSurfaceContext = React.createContext<ApiKeysSurface>('tenant-user')

export function ApiKeysSurfaceProvider({
  surface,
  children,
}: {
  surface: ApiKeysSurface
  children: React.ReactNode
}) {
  return (
    <ApiKeysSurfaceContext.Provider value={surface}>{children}</ApiKeysSurfaceContext.Provider>
  )
}

export function useApiKeysSurface(): ApiKeysSurface {
  return React.useContext(ApiKeysSurfaceContext)
}

/** Prototype profiles → Tenant Admin ≈ AI Admin; Tenant User ≈ AI Engineer. */
export const useUserProfile = () => {
  const surface = useApiKeysSurface()
  const userProfile = surface === 'tenant-admin' ? 'AI Admin' : 'AI Engineer'
  return { userProfile }
}

/** Open/close modal from `?modal=<name>` query param (prototype behavior). */
export const useModalFromURL = (modalName: string) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isOpen = searchParams.get('modal') === modalName

  const open = React.useCallback(() => {
    const next = new URLSearchParams(searchParams)
    next.set('modal', modalName)
    setSearchParams(next, { replace: true })
  }, [modalName, searchParams, setSearchParams])

  const close = React.useCallback(() => {
    const next = new URLSearchParams(searchParams)
    next.delete('modal')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  return { isOpen, open, close }
}

/** Sets `document.title` — stand-in for `@app/utils/useDocumentTitle`. */
export const useDocumentTitle = (title: string) => {
  React.useEffect(() => {
    document.title = title
  }, [title])
}

/**
 * Variant-flag stand-in. Defaults off so subscription details match read-only engineer view.
 */
export const useVariantFlags = () => {
  const isVariantFlagEnabled = (_feature: string, _variant: string) => false
  return { isVariantFlagEnabled }
}

/** Minimal CodeEditor stand-in — avoids Monaco. */
export const Language = {
  yaml: 'yaml',
} as const

interface StubCodeEditorProps {
  id?: string
  code?: string
  height?: string
  language?: string
  isLineNumbersVisible?: boolean
  isLanguageLabelVisible?: boolean
  onChange?: (value: string) => void
}

export const CodeEditor = ({
  id,
  code = '',
  height = '500px',
  language,
  isLanguageLabelVisible,
  onChange,
}: StubCodeEditorProps) => (
  <div>
    {isLanguageLabelVisible && language ? (
      <div className="pf-v6-u-mb-sm pf-v6-u-font-size-sm pf-v6-u-color-200">{language}</div>
    ) : null}
    <textarea
      id={id}
      aria-label="YAML editor"
      value={code}
      onChange={(e) => onChange?.(e.target.value)}
      spellCheck={false}
      className="pf-v6-c-form-control"
      style={{
        width: '100%',
        height,
        fontFamily: 'var(--pf-t--global--font--family--mono)',
        resize: 'vertical',
      }}
    />
  </div>
)
