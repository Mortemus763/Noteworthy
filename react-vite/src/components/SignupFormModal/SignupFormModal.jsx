import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const isFormInvalid =
    !isValidEmail(email) ||
    !email ||
    !username ||
    !first_name ||
    !last_name ||
    !password ||
    !confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        first_name,
        last_name,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-form-modal">
      <h1 className="signup-title">Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      {!isValidEmail(email) && email ? (
        <p className="email-error">InValid Email</p>
      ) : null}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form-stuff">
          <div className="signup-form-labels">
            <p className="input-label">Email:</p>
            <p className="input-label">Username:</p>
            <p className="input-label">First Name:</p>
            <p className="input-label">Last Name:</p>
            <p className="input-label">Password:</p>
            <p className="input-label">Confirm Password:</p>
          </div>

          <div className="signup-form-inputs">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.email && <p>{errors.email}</p>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.username && <p>{errors.username}</p>}

            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.first_name && <p>{errors.first_name}</p>}

            <input
              type="text"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.last_name && <p>{errors.last_name}</p>}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.password && <p>{errors.password}</p>}

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-modal-input"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
        </div>

        <button
          disabled={isFormInvalid}
          style={{
            backgroundColor: isFormInvalid ? "gray" : null,
            cursor: isFormInvalid ? "not-allowed" : "pointer",
          }}
          className="signup-button"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
