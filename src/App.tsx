import { Dashboard } from './Dashboard';
import { LoginPage } from './components/auth/LoginPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return <Dashboard onLogout={logout} />;
}

export default App;
