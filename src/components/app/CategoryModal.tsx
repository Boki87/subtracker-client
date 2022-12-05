import { useEffect, useState, SyntheticEvent } from "react";
import AppBaseModal from "../ui/AppBaseModal";
import { useModalsContext, useNavigationContext } from "../../context";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import css from "./CategoryModal.module.css";
import appFetch from "../../utils/appFetch";

const CategoryModal = () => {
  const { categoryModal } = useModalsContext();
  const { categories, setCategories } = useNavigationContext();

  const [categoryTitle, setCategoryTitle] = useState("");

  async function fetchCatData(id: string) {
    try {
      const res = await appFetch(`/categories/${id}`);
      if (!res.success) throw Error("Could not fetch data for category");
      setCategoryTitle(res.data.title);
    } catch (e) {
      console.log(e);
    }
  }

  function onInputHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setCategoryTitle(input.value);
  }

  async function updateCategory() {
    if (categoryTitle.length === 0) return;

    try {
      const res = await appFetch(`/categories/${categoryModal.categoryId}`, {
        method: "PUT",
        body: JSON.stringify({ title: categoryTitle }),
      });
      if (!res.success) throw Error("Could not update category");
      const newCats = categories.map((cat) => {
        if (cat._id === categoryModal.categoryId) {
          return {
            ...cat,
            title: categoryTitle,
          };
        } else {
          return cat;
        }
      });
      setCategories(newCats);
    } catch (e) {
      console.log(e);
    }
  }

  async function addNewCategory() {
    try {
      const res = await appFetch(`/categories`, {
        method: "POST",
        body: JSON.stringify({ title: categoryTitle }),
      });
      if (!res.success) throw Error("Could not create category");
      setCategories([...categories, res.data]);
    } catch (e) {
      console.log(e);
    }
  }

  async function onSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (categoryModal.categoryId && categoryModal.categoryId !== "") {
      //update cat
      await updateCategory();
    } else {
      //add new cat
      await addNewCategory();
    }
    categoryModal.closeCategoryModal();
  }

  useEffect(() => {
    if (categoryModal.categoryId && categoryModal.categoryId !== "") {
      fetchCatData(categoryModal.categoryId);
    } else {
      setCategoryTitle("");
    }
  }, [categoryModal.categoryId, categoryModal.isOpen]);

  return (
    <>
      {categoryModal.isOpen ? (
        <AppBaseModal backdropClick={categoryModal.closeCategoryModal}>
          <div className={css.category_modal}>
            <h1>
              {categoryModal.categoryId
                ? "Update category"
                : "Create new category"}
            </h1>
            <form
              className={css.category_modal__form}
              onSubmit={onSubmitHandler}
            >
              <div className={css.category_modal__body}>
                <AppInput
                  required
                  type="text"
                  placeholder="Category Name"
                  value={categoryTitle}
                  onInput={onInputHandler}
                />
              </div>
              <div className={css.category_modal__footer}>
                <AppButton
                  variant="primary"
                  type="submit"
                  style={{ marginRight: "10px" }}
                >
                  {categoryModal.categoryId ? "Save" : "Add"}
                </AppButton>
                <AppButton
                  onClick={() => categoryModal.closeCategoryModal()}
                  variant="secondary"
                >
                  Close
                </AppButton>
              </div>
            </form>
          </div>
        </AppBaseModal>
      ) : null}
    </>
  );
};

export default CategoryModal;
