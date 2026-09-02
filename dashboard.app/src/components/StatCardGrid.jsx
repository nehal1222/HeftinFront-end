import { useState } from 'react'
import StatCard from './StatCard.jsx'
import { STAT_CARDS } from '../data/dashboardData.js'

export default function StatCardGrid() {
  const [cards, setCards] = useState(STAT_CARDS)

  function handleDismiss(id) {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  function handleReset() {
    setCards(STAT_CARDS)
  }

  return (
    <section>
      <div className="dash-stats-head">
        <span className="dash-stats-hint">Drag a card away to dismiss it</span>
        <button type="button" className="dash-reset-btn" onClick={handleReset}>
          Reset cards
        </button>
      </div>

      <div className="dash-stats">
        {cards.length === 0 ? (
          <p className="dash-empty-cards">All cards dismissed — hit "Reset cards" to bring them back.</p>
        ) : (
          cards.map((card) => (
            <StatCard key={card.id} card={card} onDismiss={handleDismiss} />
          ))
        )}
      </div>
    </section>
  )
}
