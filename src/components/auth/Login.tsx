import { SyntheticEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../../context";
import css from "./Login.module.css";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import appFetch from "../../utils/appFetch";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const tokenRes = await appFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!tokenRes.success) {
        throw Error("Error " + tokenRes.message);
      }

      const userData = await appFetch("/auth/me");

      if (!userData.success) {
        throw Error("Authentication error");
      }

      setIsLoading(false);
      setUser({
        ...userData.data,
        token: tokenRes.token,
      });
      navigate("/");
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }
  return (
    <div className={css.login}>
      <div className={css.login_inner}>
        <div style={{ textAlign: "center" }}>
          <img src="/images/logo.png" />
        </div>
        <div className={css.login_card}>
          <form>
            <div style={{ marginBottom: "10px" }}>
              <AppInput
                outlined={false}
                type="email"
                required
                placeholder="youremail@email.com"
                value={email}
                onInput={(e: SyntheticEvent) => {
                  const input = e.target as HTMLInputElement;
                  setEmail(input.value);
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <AppInput
                outlined={false}
                required
                type="password"
                placeholder="your password"
                onInput={(e: SyntheticEvent) => {
                  const input = e.target as HTMLInputElement;
                  setPassword(input.value);
                }}
              />
            </div>
            <AppButton
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              style={{ width: "100%" }}
              onClick={loginHandler}
            >
              LOGIN
            </AppButton>
          </form>
          <div style={{ marginTop: "10px" }}>
            Dont have an account?{" "}
            <Link className="link" to="/register">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
