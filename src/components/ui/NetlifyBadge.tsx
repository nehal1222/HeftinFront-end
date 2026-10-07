import { useState, type FormEvent } from 'react'

export function NetlifyBadge() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [prompt, setPrompt] = useState('')

  function handlePromptSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const destination = new URL('https://netlify.new/')
    if (prompt.trim()) destination.searchParams.set('prompt', prompt.trim())
    window.open(destination.toString(), '_blank', 'noopener,noreferrer')
  }

  if (isDismissed) return null

  return (
    <div className="netlify-badge-container">
      {isOpen && (
        <section className="netlify-promo" aria-label="Netlify site builder" aria-live="polite">
          <header className="netlify-promo-header">
            <h2>Build your own site with Netlify</h2>
            <button
              className="netlify-promo-close"
              type="button"
              aria-label="Close Netlify site builder popup"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>
          <p className="netlify-promo-description">
            Describe what you want, and an AI agent designs, builds and deploys it in minutes.
          </p>
          <form className="netlify-prompt-form" onSubmit={handlePromptSubmit}>
            <input
              aria-label="Describe the site you want to build"
              placeholder="A shop for my handmade surfboards..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <button type="submit" aria-label="Start building with Netlify">↑</button>
          </form>
          <div className="netlify-promo-divider"><span>OR</span></div>
          <a className="netlify-drop-link" href="https://app.netlify.com/drop" target="_blank" rel="noreferrer">
            <span>Drop a site you already have</span>
            <span aria-hidden="true">→</span>
          </a>
          <button
            className="netlify-hide-badge"
            type="button"
            onClick={() => setIsDismissed(true)}
          >
            Hide this badge
          </button>
        </section>
      )}
      <button
        className="login-powered-by-netlify"
        type="button"
        aria-label="Powered by Netlify"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg className="login-powered-mark" viewBox="0 0 256 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g fill="#00B9B5">
            <rect x="120" y="22" width="17" height="44" rx="2" />
            <rect x="120" y="131" width="17" height="45" rx="2" />
            <rect x="38" y="90" width="57" height="17" rx="2" />
            <rect x="161" y="90" width="58" height="17" rx="2" />
            <path d="M82 60 92 51 107 66 107 77 96 77Z" />
            <path d="M82 137 96 120 107 120 107 131 92 146Z" />
          </g>
          <rect x="115" y="85" width="27" height="28" rx="3" fill="#FFFFFF" />
        </svg>
        <span className="login-powered-by-text">Powered by <strong>Netlify</strong></span>
      </button>
    </div>
  )
}
