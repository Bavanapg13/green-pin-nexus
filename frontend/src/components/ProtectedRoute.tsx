import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const sessionStr = localStorage.getItem('gpn_session');
  
  if (!sessionStr) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const session = JSON.parse(sessionStr);
    if (!session.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (e) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
