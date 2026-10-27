import { FiArrowUpRight, FiInfo } from 'react-icons/fi';

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function StatTile({ icon, label, value, helper, tone = 'cocoa' }) {
  return (
    <article className="stat-tile">
      <span className={`stat-tile-icon tone-${tone}`}>{icon}</span>
      <div className="stat-tile-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
    </article>
  );
}

export function Panel({ title, description, action, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <div className="panel-heading">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function DemoNotice({ children = 'Data pada halaman ini adalah data dummy untuk demonstrasi.' }) {
  return (
    <div className="demo-notice">
      <FiInfo aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function StatusPill({ value }) {
  const normalized = String(value || '').toLowerCase();
  const tone = normalized.includes('selesai') || normalized.includes('lunas') || normalized.includes('aktif') || normalized.includes('terkonfirmasi') || normalized.includes('terjadwal')
    ? 'success'
    : normalized.includes('batal') || normalized.includes('dikembalikan')
      ? 'danger'
      : normalized.includes('menunggu') || normalized.includes('tindakan') || normalized.includes('belum')
        ? 'warning'
        : 'neutral';

  return <span className={`status-pill status-${tone}`}>{value}</span>;
}

export function InlineLink({ children, ...props }) {
  return (
    <a className="inline-link" {...props}>
      {children}<FiArrowUpRight aria-hidden="true" />
    </a>
  );
}

export function Avatar({ name, className = '' }) {
  return <span className={`avatar ${className}`}>{name?.trim()?.charAt(0)?.toUpperCase() || '?'}</span>;
}
