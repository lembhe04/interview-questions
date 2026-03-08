export default function DifficultyBadge({ difficulty }) {
  const map = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  }
  return (
    <span className={map[difficulty] || 'badge-medium'}>
      {difficulty}
    </span>
  )
}
