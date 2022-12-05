import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { FaCubes, FaRegClock, FaRegStar } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import appFetch from "../utils/appFetch";
import { useUserContext } from "./";

interface InitialContextInterface {
  isNavOpen: boolean;
  isNavToggable: boolean;
  setIsNavOpen: (val: boolean) => void;
  toggleNav: () => void;
  navItems: NavType[];
  setNavItems: (navs: NavType[]) => void;
  categories: CategoryType[];
  setCategories: (arr: CategoryType[]) => void;
  activeSection: NavType | null;
  activeCategory: CategoryType | null;
}

type NavType = {
  title: string;
  name: string;
  icon: ReactNode;
  count: number;
  isActive: boolean;
};

export type CategoryType = {
  _id: string;
  title: string;
  name: string;
  count: number;
  isActive: boolean;
};

const initialState: InitialContextInterface = {
  isNavOpen: true,
  isNavToggable: false,
  setIsNavOpen: () => {},
  toggleNav: () => {},
  navItems: [],
  setNavItems: () => {},
  categories: [],
  setCategories: () => {},
  activeSection: null,
  activeCategory: null,
};

const navigationContext = createContext(initialState);
export const useNavigationContext = () => useContext(navigationContext);

const NavigationContext = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [searchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isNavToggable, setIsNavToggable] = useState(false);
  const [navItems, setNavItems] = useState<NavType[]>([
    {
      title: "All Subscriptions",
      name: "",
      icon: <FaCubes />,
      count: 0,
      isActive: true,
    },
    {
      title: "Recently Added",
      name: "recently_added",
      icon: <FaRegClock />,
      count: 0,
      isActive: false,
    },
    {
      title: "Favorites",
      name: "favorites",
      icon: <FaRegStar />,
      count: 0,
      isActive: false,
    },
  ]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [activeSection, setActiveSection] = useState<NavType | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(
    null
  );

  async function fetchCategories() {
    try {
      const categoriesRes = await appFetch("/categories");
      if (!categoriesRes.success) {
        throw Error("Error loading categories");
      }
      const formatedCats = categoriesRes.data.map((c: any) => ({
        ...c,
        isActive: false,
      }));
      if (categoriesRes.data.length > 0) {
        let c = searchParams.get("category") || "";
        if (!categoriesRes.data.map((c: any) => c.name).includes(c)) {
          c = "";
        }
        if (c === "") {
          setActiveCategory(null);
        }
        const categoriesCopy = categoriesRes.data.map((cat: any) => {
          if (cat.name === c) {
            cat.isActive = true;
            setActiveCategory(cat);
          } else {
            cat.isActive = false;
          }
          return cat;
        });
        setCategories(categoriesCopy);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function toggleNav() {
    if (isNavToggable) {
      setIsNavOpen(!isNavOpen);
    }
  }

  useEffect(() => {
    let s = searchParams.get("section") || "";
    if (s !== "categories" && !navItems.map((i) => i.name).includes(s)) {
      s = "";
    }
    const navItemsCopy = navItems.map((item) => {
      if (item.name === s) {
        item.isActive = true;
        setActiveSection(item);
      } else {
        item.isActive = false;
      }
      return item;
    });

    if (categories.length > 0) {
      let c = searchParams.get("category") || "";
      if (!categories.map((c) => c.name).includes(c)) {
        c = "";
      }
      if (c === "") {
        setActiveCategory(null);
      }
      const categoriesCopy = categories.map((cat) => {
        if (cat.name === c) {
          cat.isActive = true;
          setActiveCategory(cat);
        } else {
          cat.isActive = false;
        }
        return cat;
      });
      setCategories(categoriesCopy);
    }

    setNavItems(navItemsCopy);
  }, [searchParams.get("section"), searchParams.get("category")]);

  useEffect(() => {
    function onWinResize() {
      if (window.innerWidth < 1000) {
        setIsNavOpen(false);
        setIsNavToggable(true);
      } else {
        setIsNavOpen(true);
        setIsNavToggable(false);
      }
    }
    window.addEventListener("resize", onWinResize);
    fetchCategories();
    onWinResize();
    return () => window.removeEventListener("resize", onWinResize);
  }, [user]);

  return (
    <navigationContext.Provider
      value={{
        isNavOpen,
        setIsNavOpen,
        isNavToggable,
        toggleNav,
        navItems,
        setNavItems,
        categories,
        setCategories,
        activeSection,
        activeCategory,
      }}
    >
      {children}
    </navigationContext.Provider>
  );
};

export default NavigationContext;
