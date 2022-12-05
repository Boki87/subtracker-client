import { useEffect, useState } from "react";
import { Subscription } from "../../../types/Subscription";
import { useSearchParams, useNavigate } from "react-router-dom";
import css from "./SubscriptionItem.module.css";
import { SyntheticEvent } from "react";
import { useSubscriptionContext, useNavigationContext } from "../../../context";
import { AiFillStar } from "react-icons/ai";

interface ISubscriptionItem {
  activeSubscription: Subscription | null;
  data: Subscription;
  inSelectMode?: boolean;
  selectedSubscriptions?: string[];
}

const SubscriptionItem = ({
  data,
  activeSubscription,
  inSelectMode = false,
  selectedSubscriptions,
}: ISubscriptionItem) => {
  const [categoryName, setCategoryName] = useState("");
  const { addSelectedSubscription, removeSelectedSubscription } =
    useSubscriptionContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useNavigationContext();

  function shortName(name: string) {
    let nArr = name.split(" ");
    let short = "";
    if (nArr.length > 1) {
      nArr.forEach((n, i) => {
        if (i < 2) {
          short += n.charAt(0).toUpperCase();
        }
      });
    } else {
      short = name.charAt(0).toUpperCase();
    }
    return short;
  }

  function setSubscription() {
    if (inSelectMode) {
      return;
    }
    let params = searchParams;
    if (params.get("sub") === data.id) {
      params.delete("sub");
      //navigate("/");
      setSearchParams(params);
    } else {
      //navigate("/?sub=234124akfja");
      params.set("sub", data.id);
      setSearchParams(params);
    }
  }

  function selectHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    if (input.checked) {
      addSelectedSubscription(data.id);
    } else {
      removeSelectedSubscription(data.id);
    }
  }

  const isActive = data.id === activeSubscription?.id;
  const isSelected = selectedSubscriptions?.includes(data.id) || false;

  useEffect(() => {
    let name = "";

    if (data.categoryId) {
      if (categories.map((c) => c._id).includes(data.categoryId)) {
        name = categories.filter((c) => c._id === data.categoryId)[0].title;
      }
    }

    setCategoryName(name);
  }, [data.categoryId]);

  return (
    <div
      onClick={setSubscription}
      className={`${css.sub_item} ${isActive || isSelected ? css.active : ""}`}
    >
      <div className={css.sub_item_icon_container}>
        {!inSelectMode ? (
          <div className={css.sub_item_icon}>
            {data.isFavorite && (
              <AiFillStar className={css.sub_item_icon__star} />
            )}
            {shortName(data.name)}
          </div>
        ) : (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={selectHandler}
          />
        )}
      </div>
      <div className={`${css.sub_item_title} ellipsis`}>
        <div>{data.name}</div>
        <div>
          {categoryName !== "" ? (
            <div className={css.sub_item_title__pill}>{categoryName}</div>
          ) : null}
        </div>
      </div>
      <div className={css.sub_item_price}>
        <div>
          {data.cost} {data.currency}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
