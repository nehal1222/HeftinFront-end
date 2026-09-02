export default function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="settings-row">
      <div>
        <span className="settings-row-label">{label}</span>
        {description && <span className="settings-row-desc">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? 'toggle-switch on' : 'toggle-switch'}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  )
}
