import { useAuth } from '../hooks/useAuth'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

export default function Admin() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a1628',
      }}>
        <div style={{
          width: 32, height: 32,
          border: '2px solid #244068',
          borderTopColor: '#d4af6a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return session ? <AdminDashboard /> : <AdminLogin />
}
