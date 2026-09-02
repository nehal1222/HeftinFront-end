import { motion } from 'framer-motion'
import { LEADERBOARD, tierForRank } from '../data/dashboardData.js'

const TOP_RANK_CLASS = ['rank-gold', 'rank-silver', 'rank-bronze']

export default function LeaderboardPage() {
  return (
    <motion.section
      className="dash-panel leaderboard-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dash-panel-head">
        <h2>Leaderboard</h2>
        <span className="dash-panel-sub">This month &middot; All exams</span>
      </div>

      <div className="leaderboard-list">
        {LEADERBOARD.map((entry, index) => {
          const tier = tierForRank(entry.rank)
          const topClass = entry.rank <= 3 ? ` ${TOP_RANK_CLASS[entry.rank - 1]}` : ''
          return (
            <motion.div
              key={entry.rank}
              className={entry.self ? 'leaderboard-row self' : 'leaderboard-row'}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <span className={`leaderboard-rank${topClass}`}>#{entry.rank}</span>

              <span className="leaderboard-avatar">{entry.initials}</span>

              <div className="leaderboard-name-block">
                <span className="leaderboard-name">
                  {entry.name}
                  {entry.self && <span className="leaderboard-you">You</span>}
                </span>
                <span className="leaderboard-tier" style={{ color: tier.color }}>
                  {tier.name} tier
                </span>
              </div>

              <span className="leaderboard-score">{entry.score.toFixed(1)}%</span>

              <span
                className={
                  entry.trend > 0 ? 'leaderboard-trend up' : entry.trend < 0 ? 'leaderboard-trend down' : 'leaderboard-trend'
                }
              >
                {entry.trend > 0 ? `↑ ${entry.trend}` : entry.trend < 0 ? `↓ ${Math.abs(entry.trend)}` : '—'}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
