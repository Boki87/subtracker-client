import AppButton from "../../ui/AppButton";
import { FiLock } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";
import { BiCog } from "react-icons/bi";
import { useUserContext, useModalsContext } from "../../../context";
import useAppTheme from "../../../hooks/useAppTheme";

const NavFooter = () => {
  const { setIsSettingsOpen, isSettingsOpen } = useModalsContext();
  const { logOut } = useUserContext();
  const { activeTheme, toggleTheme } = useAppTheme();
  //TODO: open settings panel

  return (
    <div style={{ display: "flex" }}>
      <AppButton onClick={logOut} style={{ marginRight: "5px" }}>
        <FiLock />
      </AppButton>
      <AppButton onClick={toggleTheme}>
        {activeTheme === "light" ? <BsMoon /> : <BsSun />}
      </AppButton>
      <AppButton onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
        <BiCog />
      </AppButton>
    </div>
  );
};

export default NavFooter;
