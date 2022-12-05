import { useRef, useState, useMemo, SyntheticEvent } from "react";
import { BsTags, BsTag, BsChevronRight } from "react-icons/bs";
import css from "./NavItemGroup.module.css";
import AppButton from "../../ui/AppButton";
import { BsPlus } from "react-icons/bs";
import { BiMinus, BiEditAlt } from "react-icons/bi";
import { useModalsContext, useNavigationContext } from "../../../context";
import { useSearchParams, useNavigate } from "react-router-dom";
import appFetch from "../../../utils/appFetch";

interface NavItemGroupInterface {
  title: string;
  items: {
    _id: string;
    title: string;
    name: string;
    isActive?: boolean;
    count?: number;
  }[];
}

const NavItemGroup = ({ title, items }: NavItemGroupInterface) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryModal, confirmModal } = useModalsContext();
  const { categories, setCategories } = useNavigationContext();

  const [isOpen, setIsOpen] = useState(false);
  const items_wrapper = useRef<HTMLInputElement>(null);

  function categoryEditHandler(id: string) {
    categoryModal.openCategoryModal(id);
  }

  async function categoryDeleteHandler(id: string) {
    const res = await confirmModal.openConfirmModal(
      "Are you sure you want to delete this category?"
    );

    if (!res) return;

    try {
      const res = await appFetch(`/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.success) throw Error("Could not delete category");
      const newCats = categories.filter((cat) => cat._id !== id);
      setCategories(newCats);
      const catCheck = searchParams.get("category");
      if (catCheck) {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const groupItemsWrapperStyle = useMemo(() => {
    return {
      transition: "height 0.2s ease-in-out",
      height: isOpen ? categories.length * 35 + 35 + "px" : "0px",
      width: "100%",
      overflow: "hidden",
    };
  }, [categories.length, isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className={css.nav_item_group}>
        <div className={css.nav_item_group_icon}>
          <BsTags />
        </div>
        <div>{title}</div>
        <div style={{ flex: 1 }}></div>
        <div className={css.nav_item_group_arrow}>
          <BsChevronRight
            style={{
              transition: "transform 0.3s ease-in-out",
              transform: isOpen ? "rotate(90deg)" : "",
            }}
          />
        </div>
      </div>
      <div style={groupItemsWrapperStyle}>
        <div ref={items_wrapper}>
          {items.map((item) => (
            <NavGroupItem
              title={item.title}
              name={item.name}
              isActive={item.isActive}
              onEdit={() => categoryEditHandler(item._id)}
              onDelete={() => categoryDeleteHandler(item._id)}
              key={item.name}
            />
          ))}
          <AppButton
            onClick={() => categoryModal.openCategoryModal(null)}
            style={{
              height: "30px",
              fontSize: "0.8rem",
              borderRadius: "10px",
              width: "100%",
            }}
            variant="secondary"
          >
            <span>Add Category</span>
            <BsPlus style={{ fontSize: "1.3rem" }} />
          </AppButton>
        </div>
      </div>
    </>
  );
};

export default NavItemGroup;
interface NavGroupItemInterface {
  title: string;
  name: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const NavGroupItem = ({
  title,
  name,
  isActive,
  onEdit,
  onDelete,
}: NavGroupItemInterface) => {
  const [searchParams, setSearchParams] = useSearchParams();
  function setActiveCategory() {
    setSearchParams({ category: name, section: "categories" });
  }

  function onEditHandler(e: SyntheticEvent) {
    e.stopPropagation();
    onEdit && onEdit();
  }

  function onDeleteHandler(e: SyntheticEvent) {
    e.stopPropagation();
    onDelete && onDelete();
  }

  return (
    <div
      className={
        isActive ? `${css.nav_group_item} ${css.active}` : css.nav_group_item
      }
      onClick={setActiveCategory}
    >
      <div className={css.nav_item_group_icon}>
        <BsTag />
      </div>
      <div style={{ flex: 1 }} className="ellipsis">
        {title}
      </div>
      <div className={css.nav_group_item__controls}>
        <div onClick={onEditHandler} className={css.nab_group_itme__control}>
          <BiEditAlt />
        </div>
        <div onClick={onDeleteHandler} className={css.nab_group_itme__control}>
          <BiMinus />
        </div>
      </div>
    </div>
  );
};
