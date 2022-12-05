import { useState, useEffect, ReactNode, SyntheticEvent } from "react";
import { useNavigationContext, useSubscriptionContext } from "../../../context";
import { BsTags, BsCheck2All, BsTrash } from "react-icons/bs";
import css from "./SubscriptionListHeader.module.css";
import AppButton from "../../ui/AppButton";
import { HiOutlinePlus } from "react-icons/hi";
import { VscChecklist } from "react-icons/vsc";
import { TfiSearch } from "react-icons/tfi";
import { IoCloseOutline } from "react-icons/io5";
import AppInput from "../../ui/AppInput";

const SubscriptionListHeader = ({
  toggleAll,
  searchHandler,
}: {
  toggleAll: () => void;
  searchHandler: (val: string) => void;
}) => {
  const { activeSection, activeCategory, toggleNav } = useNavigationContext();
  const {
    activateSelectMode,
    deactivateSelectMode,
    inSelectMode,
    selectedSubscriptions,
    listMode,
    setListMode,
    deleteSelectedSubscriptionsHandler,
    addNewSub,
  } = useSubscriptionContext();

  const [showSearch, setShowSearch] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<ReactNode>(<BsTags />);

  useEffect(() => {
    if (!activeCategory && activeSection) {
      setIcon(activeSection.icon);
    } else if (activeCategory) {
      setIcon(<BsTags />);
    }

    if (activeSection && !activeCategory) {
      setTitle(activeSection.title);
    } else if (activeCategory) {
      setTitle(activeCategory.title);
    }
  }, [activeSection, activeCategory]);

  useEffect(() => {
    if (showSearch) {
      setListMode("search");
    } else {
      if (inSelectMode) {
        setListMode("select");
      } else {
        setListMode("base");
      }
    }
  }, [inSelectMode, showSearch]);

  useEffect(() => {
    function escapePressed(e: KeyboardEvent) {
      if (listMode === "search" && e.key === "Escape") {
        searchHandler("");
        setShowSearch(false);
      }
    }
    window.addEventListener("keyup", escapePressed);

    return () => window.removeEventListener("keyup", escapePressed);
  }, [listMode]);

  let form;
  switch (listMode) {
    case "base":
      form = (
        <>
          <AppButton
            style={{ flex: 1, justifyContent: "flex-start" }}
            onClick={toggleNav}
          >
            <div className={css.list_header_icon}>{icon}</div>
            <div className={`${css.list_header_title} ellipsis`}>{title}</div>
          </AppButton>
          <div className={css.list_header_actions}>
            <AppButton onClick={activateSelectMode}>
              <VscChecklist />
            </AppButton>
            <AppButton onClick={addNewSub}>
              <HiOutlinePlus />
            </AppButton>
            <AppButton
              onClick={() => {
                setShowSearch(true);
              }}
            >
              <TfiSearch />
            </AppButton>
          </div>
        </>
      );
      break;
    case "select":
      form = (
        <>
          <AppButton onClick={deactivateSelectMode}>
            <IoCloseOutline />
          </AppButton>

          <AppButton onClick={toggleAll}>
            <BsCheck2All />
          </AppButton>
          <div style={{ flex: 1, textAlign: "center" }}>
            {selectedSubscriptions.length} items selected
          </div>
          <AppButton onClick={deleteSelectedSubscriptionsHandler}>
            <BsTrash />
          </AppButton>
        </>
      );
      break;
    case "search":
      form = (
        <>
          <AppInput
            outlined={false}
            leftElement={<TfiSearch />}
            focusOnRender={true}
            onInput={(e: SyntheticEvent) => {
              const input = e.target as HTMLInputElement;
              searchHandler(input.value);
            }}
            rightElement={
              <AppButton
                onClick={() => {
                  searchHandler("");
                  setShowSearch(false);
                }}
              >
                <IoCloseOutline />
              </AppButton>
            }
          />
        </>
      );
  }

  return <div className={css.list_header}>{form}</div>;
};

export default SubscriptionListHeader;
