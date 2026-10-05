import { canAccess } from '../utils/rights.js'
import Forbidden from './Forbidden.jsx'

export default function RequireRight({ auth, right, scope, children }) {
  if (!canAccess(auth, right, scope)) return <Forbidden requiredRight={right} />
  return children
}