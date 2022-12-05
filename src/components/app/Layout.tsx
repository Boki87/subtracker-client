import css from "./Layout.module.css";
import SideNav from "./sidenav/SideNav";
import SubscriptionList from "./sublist/SubscriptionList";
import SubscriptionEditor from "./subeditor/SubscriptionEditor";
import { useNavigationContext } from "../../context";

const Layout = () => {
  const { isNavOpen, isNavToggable, toggleNav } = useNavigationContext();

  return (
    <div className={css.layout}>
      <SideNav />
      <div className={css.layout_main}>
        <div className={css.layout_main_inner}>
          <SubscriptionList />
          <SubscriptionEditor />
        </div>

        {isNavOpen && isNavToggable ? (
          <div className={css.nav_scrim} onClick={toggleNav}></div>
        ) : null}
      </div>
    </div>
  );
};
export default Layout;
