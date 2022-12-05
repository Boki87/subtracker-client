import { SyntheticEvent, useEffect, useState } from "react";
import css from "./SubscriptionList.module.css";
import { useNavigationContext, useSubscriptionContext } from "../../../context";
import { useSearchParams, useNavigate } from "react-router-dom";
import SubscriptionListHeader from "./SubscriptionListHeader";
import SubscriptionItem from "./SubscriptionItem";
import { Subscription } from "../../../types/Subscription";

const SubscriptionList = () => {
  const {
    isSubEditorOpen,
    isSubEditorToggable,
    subscriptions,
    activeSubscription,
    listMode,
    selectedSubscriptions,
    setSelectedSubscriptions,
  } = useSubscriptionContext();
  const { toggleNav, activeCategory, activeSection } = useNavigationContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [searchString, setSearchString] = useState("");

  function setSubscription(id: string) {
    let params = searchParams;
    if (params.get("sub")) {
      params.delete("sub");
      //navigate("/");
      setSearchParams(params);
    } else {
      //navigate("/?sub=234124akfja");
      params.append("sub", id);
      setSearchParams(params);
    }
  }

  function toggleAllHandler() {
    if (selectedSubscriptions.length !== filteredSubscriptions.length) {
      setSelectedSubscriptions(filteredSubscriptions.map((s) => s.id));
    } else {
      setSelectedSubscriptions([]);
    }
  }

  function searchHandler(val: string) {
    setSearchString(val);
  }

  useEffect(() => {
    let subscriptionsCopy = [...subscriptions];
    if (activeSection && !activeCategory) {
      if (activeSection.name === "") {
        subscriptionsCopy = [...subscriptions];
      }
      if (activeSection.name === "recently_added") {
        subscriptionsCopy = subscriptions.filter((s) => {
          if (!s.createdAt) {
            return;
          }

          let createdAt: any = new Date(s.createdAt);
          let now: any = new Date();
          const diffTime = Math.abs(now - createdAt);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < 2) {
            return s;
          }
        });
      }
      if (activeSection.name === "favorites") {
        subscriptionsCopy = subscriptions.filter((s) => s.isFavorite);
      }
    } else if (activeCategory) {
      subscriptionsCopy = subscriptions.filter((s) => {
        if (s.categoryId === activeCategory?._id) {
          return s;
        }
      });
    }

    if (searchString !== "") {
      subscriptionsCopy = subscriptionsCopy.filter((s) =>
        s.name.toLowerCase().includes(searchString)
      );
    }
    setFilteredSubscriptions(subscriptionsCopy);
  }, [activeSection, activeCategory, subscriptions, searchString]);

  return (
    <div
      className={
        isSubEditorOpen && isSubEditorToggable
          ? `${css.sub_list} ${css.hidden}`
          : css.sub_list
      }
    >
      <div className={css.sub_list_inner}>
        <SubscriptionListHeader
          toggleAll={toggleAllHandler}
          searchHandler={searchHandler}
        />
        <div className={css.sub_list_items}>
          {filteredSubscriptions.map((sub) => (
            <SubscriptionItem
              inSelectMode={listMode === "select"}
              selectedSubscriptions={selectedSubscriptions}
              data={sub}
              activeSubscription={activeSubscription}
              key={sub.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SubscriptionList;
