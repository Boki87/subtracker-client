import { SyntheticEvent, useLayoutEffect, useState } from "react";
import css from "./SettingsModal.module.css";
import { useModalsContext, useUserContext } from "../../context";
import AppInput from "../ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import useCurrency from "../../hooks/useCurrency";
import appFetch from "../../utils/appFetch";

function SettingsPanel() {
  const { isSettingsOpen, setIsSettingsOpen } = useModalsContext();
  const { user, setUser } = useUserContext();
  const [isOnMobile, setIsOnMobile] = useState(false);

  const currencies = useCurrency();

  async function changeCurrency(e: SyntheticEvent) {
    let select = e.target as HTMLSelectElement;

    try {
      const res = await appFetch(`/auth/updatedetails`, {
        method: "PUT",
        body: JSON.stringify({ ...user, defaultCurrency: select.value }),
      });
      console.log(res);
      setUser({ ...user, defaultCurrency: select.value });
    } catch (e) {
      console.log(e);
    }
  }

  async function submitHandler(e: SyntheticEvent) {}

  if (!isSettingsOpen || !user) return null;

  //useLayoutEffect(() => {}, []);

  return (
    <div className={css.settings_panel}>
      <div style={{ display: "flex" }}>
        <span>Settings Panel</span>
        <div className="flex-fill"></div>
        <AppButton onClick={() => setIsSettingsOpen(false)}>x</AppButton>
      </div>
      <form onSubmit={submitHandler}>
        <div className={css.settings_panel__input_group}>
          <span>Email:</span>
          <AppInput value={user.email} outlined={false} />
        </div>
        <div className={css.settings_panel__input_group}>
          <span>Full Name:</span>
          <AppInput value={user.name} outlined={false} />
        </div>
        <div className={css.settings_panel__input_group}>
          <span>Default Currency:</span>
          <select
            value={user.defaultCurrency || "EUR"}
            onChange={changeCurrency}
            className="app_select"
            style={{ width: "100%" }}
          >
            {currencies.map((currency) => (
              <option value={currency.short} key={currency.short}>
                {currency.long}
              </option>
            ))}
          </select>
        </div>
        <div>
          <AppButton type="submit" variant="primary">
            SAVE
          </AppButton>
        </div>
      </form>
    </div>
  );
}

export default SettingsPanel;
