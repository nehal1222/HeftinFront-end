import { DEMO_PERSONAS } from '@/data/mockAuth.js'

export default function PersonaSwitcher({ personaId, onChange }) {
  return (
    <label className="persona-switcher">
      <span>ACTIVE ROLE</span>
      <select value={personaId} onChange={(event) => onChange(event.target.value)} aria-label="Active role">
        {DEMO_PERSONAS.map((persona) => <option key={persona.id} value={persona.id}>{persona.label}</option>)}
      </select>
    </label>
  )
}
