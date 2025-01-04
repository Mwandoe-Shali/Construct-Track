import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { RootState } from '../store';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import SupervisorDashboard from '../components/dashboard/SupervisorDashboard';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) return null;

  return user.role === 'manager' ? <ManagerDashboard /> : <SupervisorDashboard />;
}