import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import type React from "react";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
  };

  return (
    <main>
      <div
        className="form-container {
"
      >
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter password"
              type="password"
              id="password"
              name="password"
            />
          </div>

          <button className="button primary-button">Login</button>
        </form>

        <p>Dont' have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  );
};

export default Login;
