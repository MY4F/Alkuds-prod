import { useState } from "react";
import kuds from "../assets/images/kuds.png";
import CircularProgress from "@mui/material/CircularProgress";
import { useLogin } from "../hooks/useLogin";
import Alert from '@mui/material/Alert';
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async () => {
    console.log(password, email);
    await login(email, password);
  };

  return (
    <div className="login-container">
      <div className="user-data-holder">
        <img style={{ width: "50%" }} src={kuds} />
        {error && <Alert severity="error">{error}</Alert>}
        <label>اسم المستخدم</label>
        <input
          type="email"
          placeholder="ادخل اسم المستخدم"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          name="email"
          autoComplete="on"
        />
        <label>كلمه المرور</label>
        <input
          type="password"
          placeholder="ادخل كلمه السر"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          name="password"
          autoComplete="on"
        />
        <button onClick={handleSubmit} className="login-button" type="submit">
          {!isLoading ? "تسجيل دخول" : <CircularProgress />}
        </button>
      </div>
    </div>
  );
};

export default Login;
