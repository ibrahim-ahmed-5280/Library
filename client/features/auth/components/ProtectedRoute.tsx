import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { Loading } from '../../../shared/components/ui'

export default function Protected({ staff = false }: { staff?: boolean }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (staff && user.role === 'member') return <Navigate to="/account" replace />
  return <Outlet />
}
