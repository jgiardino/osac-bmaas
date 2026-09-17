import type { CatalogSpecRow } from '../../catalog/catalogSpecs'
import { CatalogClusterVersionValue } from './CatalogClusterVersionValue'
import { CatalogDiskImageValue } from './CatalogDiskImageValue'
import { CatalogSpecValueWithBadge } from './CatalogSpecValueWithBadge'

const DISK_IMAGE_SPEC_LABELS = new Set(['OS image', 'Disk image'])

type CatalogSpecRowsListProps = {
  rows: CatalogSpecRow[]
  className?: string
  rowClassName?: string
  labelClassName?: string
  valueClassName?: string
  idPrefix?: string
}

export function CatalogSpecRowsList({
  rows,
  className,
  rowClassName = 'provider-admin-catalog-items__spec-row',
  labelClassName = 'provider-admin-catalog-items__spec-label',
  valueClassName = 'provider-admin-catalog-items__spec-value',
  idPrefix = 'catalog-spec',
}: CatalogSpecRowsListProps) {
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.label} className={rowClassName}>
          <dt className={labelClassName}>{row.label}</dt>
          <dd className={valueClassName}>
            {row.label === 'Cluster version' ? (
              <CatalogClusterVersionValue badge={row.badge}>{row.value}</CatalogClusterVersionValue>
            ) : DISK_IMAGE_SPEC_LABELS.has(row.label) ? (
              <CatalogDiskImageValue badge={row.badge}>{row.value}</CatalogDiskImageValue>
            ) : (
              <CatalogSpecValueWithBadge
                value={row.value}
                badge={row.badge}
                id={`${idPrefix}-badge-${row.label}-${row.badge?.text ?? ''}`.replace(/\s+/g, '-')}
              />
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
