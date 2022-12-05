import { SyntheticEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../../context";
import css from "./Register.module.css";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import appFetch from "../../utils/appFetch";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function registerHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const tokenRes = await appFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
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
    <div className={css.register}>
      <div className={css.register_inner}>
        <div style={{ textAlign: "center" }}>
          <img src="/images/logo.png" />
        </div>
        <div className={css.register_card}>
          <form onSubmit={registerHandler}>
            <div style={{ marginBottom: "10px" }}>
              <AppInput
                outlined={false}
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onInput={(e: SyntheticEvent) => {
                  const input = e.target as HTMLInputElement;
                  setName(input.value);
                }}
              />
            </div>
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
            >
              REGISTER
            </AppButton>
          </form>
          <div style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
