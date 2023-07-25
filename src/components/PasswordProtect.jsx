import { useEffect, useState } from 'react';

export const PasswordProtect = ({ children, passwordRequired }) => {
  const [password, setPassword] = useState('');
  const [correctPassword, setCorrectPassword] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (passwordRequired) {
      fetch(`https://hashnode-passchecks.smacode.repl.co/`)
        .then((response) => response.text()) // assuming the server responds with the password as plain text
        .then(setCorrectPassword)
        .catch(console.error);
    }
  }, [passwordRequired]);

  const checkPassword = (input) => {
    if (input === correctPassword) {
      setAccessGranted(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!passwordRequired || accessGranted) {
    return children;
  } else {
    return (
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={() => checkPassword(password)}>Submit</button>
      </div>
    );
  }
};

export default PasswordProtect;
