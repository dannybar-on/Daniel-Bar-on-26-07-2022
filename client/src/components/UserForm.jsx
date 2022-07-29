import { useState } from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import { useAuthContext } from '../hooks/useAuthContext';

const UserForm = () => {
  const { dispatch } = useAdminContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.isAdmin) {
      setError('You must be an admin');
      return;
    }

    const userData = { email, password, isAdmin };

    const response = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      setEmail('');
      setPassword('');
      setIsAdmin('');
      setEmptyFields([]);
      dispatch({ type: 'CREATE_USER', payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New User</h3>

      <label>User Email:</label>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className={emptyFields.includes('email') ? 'error' : ''}
      />

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className={emptyFields.includes('password') ? 'error' : ''}
      />

      <label>Is Admin:</label>
      <select
        onChange={(e) => setIsAdmin(e.target.value)}
        value={isAdmin}
        className={emptyFields.includes('isAdmin') ? 'error' : ''}
      >
        <option value="">Select</option>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
      <br />

      <button>Add User</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default UserForm;
