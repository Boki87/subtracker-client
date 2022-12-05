import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import css from "./NavItem.module.css";

interface NavItemInterface {
  title: string;
  name: string;
  icon?: ReactNode;
  isActive?: boolean;
  count?: number | null;
}

const NavItem = ({ title, name, icon, isActive, count }: NavItemInterface) => {
  const navigate = useNavigate();

  function setActiveSection() {
    navigate(`/?section=${name}`);
  }

  return (
    <div
      onClick={setActiveSection}
      className={`${css.nav_item} ${isActive ? css.active : null}`}
    >
      {icon && <div className={css.nav_item_icon}>{icon}</div>}
      <div className="ellipsis" style={{ flex: 1 }}>
        {title}
      </div>
      <div className={css.nav_item_count}>{count}</div>
    </div>
  );
};

export default NavItem;
