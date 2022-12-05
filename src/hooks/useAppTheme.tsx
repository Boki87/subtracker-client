import { useState } from "react";

const useAppTheme = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    try {
      const body = document.querySelector("body");
      const theme = window.localStorage.getItem("subtracker-theme");
      if (theme && theme != "") {
        if (!body?.classList.contains("dark_mode")) {
          body?.classList.add("dark_mode");
          return "dark";
        }
      } else {
        body?.classList.remove("dark_mode");
        return "light";
      }
    } catch (e) {
      return "light";
    }
  });

  const toggleTheme = () => {
    const theme = activeTheme === "light" ? "dark" : "light";

    setActiveTheme(theme);
    const body = document.querySelector("body");
    if (theme === "dark") {
      body?.classList.add("dark_mode");
      localStorage.setItem("subtracker-theme", "dark");
    } else {
      body?.classList.remove("dark_mode");
      localStorage.removeItem("subtracker-theme");
    }
  };

  const initTheme = () => {
    const body = document.querySelector("body");
    const theme = window.localStorage.getItem("subtracker-theme");
    if (theme && theme != "") {
      if (!body?.classList.contains("dark_mode")) {
        body?.classList.add("dark_mode");
        setActiveTheme("dark");
      }
    } else {
      body?.classList.remove("dark_mode");
      setActiveTheme("light");
    }
  };

  return { activeTheme, toggleTheme, initTheme };
};

export default useAppTheme;
