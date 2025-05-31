import { useState } from "react";
import kuds from "../assets/images/kuds.png";
import CircularProgress from "@mui/material/CircularProgress";
import { useLogin } from "../hooks/useLogin";
import Alert from "@mui/material/Alert";
import { ReactComponent as EyeIcon } from "../assets/icons/eye.svg";
import { ReactComponent as EyeHiddenIcon } from "../assets/icons/eye.hide.svg";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { login, error, isLoading } = useLogin();
  const [hiddenPassword, setHiddenPassword] = useState(true);
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
        <div className="relative">
          <input
            type={hiddenPassword ? "password" : "text"}
            placeholder="ادخل كلمه السر"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            name="password"
            autoComplete="on"
            className="pl-4"
          />
          {hiddenPassword ? (
            <EyeHiddenIcon
              onClick={() => {
                setHiddenPassword(false);
              }}
              className="size-5 cursor-pointer absolute top-1/2 left-2 -translate-y-1/2"
            />
          ) : (
            <EyeIcon
              onClick={() => {
                setHiddenPassword(true);
              }}
              className="size-5 cursor-pointer absolute top-1/2 left-2 -translate-y-1/2"
            />
          )}
        </div>
        <button onClick={handleSubmit} className="login-button" type="submit">
          {!isLoading ? "تسجيل دخول" : <CircularProgress />}
        </button>
      </div>
    </div>
  );
};

export default Login;
