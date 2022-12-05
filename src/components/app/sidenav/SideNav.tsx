import { useMemo, useState } from "react";
import css from "./SideNav.module.css";
import { useNavigationContext } from "../../../context";
import NavItem from "./NavItem";
import NavItemGroup from "./NavItemGroup";
import { FaCubes, FaRegClock, FaRegStar } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import NavFooter from "./NavFooter";
import AppButton from '../../ui/AppButton'

const SideNav = () => {
  const { isNavOpen, navItems, categories } = useNavigationContext();

  return (
    <div className={isNavOpen ? `${css.sidenav} ${css.active}` : css.sidenav}>
      <div className={css.sidenav_inner}>
        <div className={css.sidenav_inner_logo_container}>
          <img src="/images/logo.png" style={{ width: "200px" }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <div className={css.sidenav_cat_title}>Subs & items</div>
          {navItems.map((item) => (
            <NavItem
              title={item.title}
              name={item.name}
              isActive={item.isActive}
              icon={item.icon}
              count={item.count}
              key={item.name}
            />
          ))}
          <NavItemGroup title="Categories" items={categories} />
        </div>
        <div style={{ flex: 1 }}></div>
        <NavFooter />
      </div>
    </div>
  );
};

export default SideNav;
