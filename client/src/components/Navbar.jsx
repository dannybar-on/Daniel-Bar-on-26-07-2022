import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Chat Buddy</h1>
        </Link>
        <nav>
          {user ? (
            <>
              {user.isAdmin && (
                <Link className="panel" to="/admin">
                  <button>Admin</button>
                </Link>
              )}
              <div>
                <span>{user.email}</span>
                <button onClick={handleClick}>Log out</button>
                <Link to="/buddies">
                  <button>Buddies</button>
                </Link>
              </div>
            </>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
