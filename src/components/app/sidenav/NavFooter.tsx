import AppButton from "../../ui/AppButton";
import { FiLock } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";
import { BiCog } from "react-icons/bi";
import { useUserContext } from "../../../context";
import useAppTheme from "../../../hooks/useAppTheme";

const NavFooter = () => {
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
      <AppButton>
        <BiCog />
      </AppButton>
    </div>
  );
};

export default NavFooter;
