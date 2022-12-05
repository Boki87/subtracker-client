import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { useSubscriptionContext, useNavigationContext } from "../../../context";
import { useNavigate } from "react-router-dom";
import { CgFileDocument } from "react-icons/cg";
import AppInput from "../../../components/ui/AppInput";
import { Subscription } from "../../../types/Subscription";
import css from "./EditorForm.module.css";
import AppButton from "../../ui/AppButton";
import { AiOutlineStar, AiFillStar, AiOutlineCheck } from "react-icons/ai";
import { MdOutlineModeEditOutline, MdOutlineEditOff } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import AppToggleInput from "../../ui/AppToggleInput";
import useCurrency from "../../../hooks/useCurrency";
import { HiArrowLongLeft } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";

const EditorForm = () => {
  const {
    activeSubscription,
    updateSingleSubscription,
    isUpdatingSubscriptions,
    deleteSingleSubscription,
  } = useSubscriptionContext();

  const { categories } = useNavigationContext();

  const navigate = useNavigate();

  const [canEdit, setCanEdit] = useState(false);
  const [subData, setSubData] = useState<Subscription | null>(null);

  const currencies = useCurrency();

  function inputHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setSubData({ ...subData, [input.name]: input.value });
  }

  function toggleFavorite() {
    if (!subData) return;
    const newSubData = { ...subData, isFavorite: !subData.isFavorite };
    setSubData(newSubData);
    updateSingleSubscription(newSubData);
  }

  function cancelSave() {
    setSubData(activeSubscription);
    setCanEdit(false);
  }

  function saveChanges() {
    if (!subData) return;
    updateSingleSubscription(subData);
  }

  function changeCurrency(e: SyntheticEvent) {
    let select = e.target as HTMLSelectElement;
    setSubData({ ...subData, currency: select.value });
  }

  function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    saveChanges();
  }

  function changeCategory(e: SyntheticEvent) {
    let select = e.target as HTMLSelectElement;
    setSubData({ ...subData, categoryId: select.value });
  }

  useEffect(() => {
    setCanEdit(false);
    setSubData(activeSubscription);
  }, [activeSubscription?.id]);

  if (!subData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <CgFileDocument style={{ fontSize: "3rem" }} />
        <span>No item selected</span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submitHandler} style={{ height: "100%" }}>
        <div className={css.editor_form__header}>
          <div className={css.editor_form__back_button}>
            <AppButton
              onClick={() => navigate(-1)}
              style={{ fontSize: "1.3rem" }}
            >
              <HiArrowLongLeft />
            </AppButton>
          </div>
          <div className="flex-fill"></div>
          <AppButton onClick={() => deleteSingleSubscription(subData.id)}>
            <BsTrash />
          </AppButton>
          <AppButton
            style={{ fontSize: "1.4rem" }}
            onClick={toggleFavorite}
            loading={isUpdatingSubscriptions}
          >
            {subData.isFavorite ? (
              <AiFillStar style={{ color: "orange" }} />
            ) : (
              <AiOutlineStar />
            )}
          </AppButton>

          {!canEdit ? (
            <AppButton
              onClick={() => {
                setCanEdit(true);
              }}
            >
              <MdOutlineModeEditOutline />
            </AppButton>
          ) : (
            <AppButton onClick={cancelSave}>
              <MdOutlineEditOff />
            </AppButton>
          )}
        </div>
        <div className={css.editor_form__wrapper}>
          <div className={css.editor_form}>
            {/*Name*/}
            <div className={css.editor_form__input_group}>
              <span className={css.editor_form__tag}>Name</span>
              <AppInput
                name="name"
                outlined={false}
                value={subData.name}
                onInput={inputHandler}
                required
                disabled={!canEdit}
              />
            </div>
            {/*Name END*/}

            {/*Category picker*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              <div
                style={{
                  flex: 1,
                  marginRight: "10px",
                  maxWidth: "250px",
                  minWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <span>Add to category</span>
              </div>
              <div className="flex-fill"></div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  minWidth: "240px",
                }}
              >
                <select
                  disabled={!canEdit}
                  value={
                    subData.categoryId &&
                    categories.map((c) => c._id).includes(subData.categoryId)
                      ? subData.categoryId
                      : -1
                  }
                  onChange={changeCategory}
                  className="app_select"
                  style={{ width: "100%" }}
                >
                  <option disabled value={-1}>
                    Pick one
                  </option>

                  {categories.map((category) => (
                    <option value={category._id} key={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <div
                  onClick={() =>
                    canEdit && setSubData({ ...subData, categoryId: null })
                  }
                  style={{
                    height: "calc(100% - 6px)",
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-shade-2)",
                    cursor: canEdit ? "pointer" : "not-allowed",
                    background: "var(--color-background)",
                  }}
                >
                  <IoCloseOutline />
                </div>
              </div>
            </div>
            {/*Categry picker END*/}

            {/*Cost*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex" }}
            >
              <div style={{ flex: 1, marginRight: "10px", maxWidth: "100px" }}>
                <span className={css.editor_form__tag}>Cost</span>
                <AppInput
                  name="cost"
                  outlined={false}
                  value={subData.cost}
                  onInput={inputHandler}
                  type="number"
                  required
                  disabled={!canEdit}
                />
              </div>
              <div className="flex-fill"></div>
              <div style={{ flex: 1, maxWidth: "240px" }}>
                <span
                  className={css.editor_form__tag}
                  style={{ display: "block" }}
                >
                  Currency
                </span>
                <select
                  disabled={!canEdit}
                  value={subData.currency}
                  onChange={changeCurrency}
                  className="app_select"
                >
                  {currencies.map((currency) => (
                    <option value={currency.short} key={currency.short}>
                      {currency.long}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/*Cost END*/}

            {/*Disabled toggle*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex", height: "60px" }}
            >
              <div className="flex-height-center pl-20">Is Disabled</div>
              <div className="flex-fill"></div>
              <div className="flex-height-center">
                <AppToggleInput
                  isChecked={subData.isDisabled ? subData.isDisabled : false}
                  disabled={!canEdit}
                  onChange={() => {
                    setSubData({ ...subData, isDisabled: !subData.isDisabled });
                  }}
                />
              </div>
            </div>
            {/*Disabled Toggle END*/}

            {/*First bill*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex", height: "60px" }}
            >
              <div className="flex-height-center pl-20">First bill</div>
              <div className="flex-fill"></div>
              <div className="flex-height-center">
                <AppInput
                  name="firstBill"
                  outlined={false}
                  value={
                    subData.firstBill ? subData.firstBill.split("T")[0] : ""
                  }
                  onInput={inputHandler}
                  type="date"
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>
            {/*First bill END*/}

            {/*Cycle period*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex" }}
            >
              <div className="flex-height-center pl-20" style={{ flex: 1 }}>
                Cycle every
              </div>
              <div style={{ marginRight: "10px" }}>
                <select
                  className="app_select"
                  value={subData.cycleMultiplier}
                  disabled={!canEdit}
                  onChange={(e: SyntheticEvent) => {
                    const select = e.target as HTMLSelectElement;
                    setSubData({
                      ...subData,
                      cycleMultiplier: parseInt(select.value),
                    });
                  }}
                >
                  {[...Array(30).keys()].map((day) => {
                    let d = day + 1;
                    return (
                      <option value={d} key={d}>
                        {d}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <select
                  className="app_select"
                  disabled={!canEdit}
                  onChange={(e: SyntheticEvent) => {
                    const select = e.target as HTMLSelectElement;
                    setSubData({ ...subData, cyclePeriod: select.value });
                  }}
                  value={subData.cyclePeriod}
                >
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>
            {/*Cycle period END*/}
            {/*Duration period*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex" }}
            >
              <div className="flex-height-center pl-20" style={{ flex: 1 }}>
                Duration
              </div>
              {subData.durationPeriod !== "forever" && (
                <div style={{ marginRight: "10px" }}>
                  <select
                    className="app_select"
                    value={subData.durationMultiplier}
                    disabled={!canEdit || subData.durationPeriod === "forever"}
                    onChange={(e: SyntheticEvent) => {
                      const select = e.target as HTMLSelectElement;
                      setSubData({
                        ...subData,
                        durationMultiplier: parseInt(select.value),
                      });
                    }}
                  >
                    {[...Array(30).keys()].map((day) => {
                      let d = day + 1;
                      return (
                        <option value={d} key={d}>
                          {d}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <div>
                <select
                  className="app_select"
                  disabled={!canEdit}
                  onChange={(e: SyntheticEvent) => {
                    const select = e.target as HTMLSelectElement;
                    setSubData({ ...subData, durationPeriod: select.value });
                  }}
                  value={subData.durationPeriod}
                >
                  <option value="forever">Forever</option>
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>
            {/*Duration period END*/}
            {/*Remind period*/}
            <div
              className={css.editor_form__input_group}
              style={{ display: "flex" }}
            >
              <div className="flex-height-center pl-20" style={{ flex: 1 }}>
                Remind me in
              </div>
              <div style={{ marginRight: "10px" }}>
                <select
                  className="app_select"
                  value={subData.remindMeBeforeDays}
                  disabled={!canEdit}
                  onChange={(e: SyntheticEvent) => {
                    const select = e.target as HTMLSelectElement;
                    setSubData({
                      ...subData,
                      remindMeBeforeDays: parseInt(select.value),
                    });
                  }}
                >
                  {[...Array(30).keys()].map((day) => {
                    let d = day + 1;
                    return (
                      <option value={d} key={d}>
                        {d}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex-height-center">Day(s) before</div>
            </div>
            {/*Remind period END*/}
          </div>
        </div>
        {canEdit ? (
          <div className={css.editor_form__actions}>
            <AppButton
              variant="primary"
              style={{ marginRight: "10px", minWidth: "100px" }}
              type="submit"
              loading={isUpdatingSubscriptions}
            >
              <AiOutlineCheck style={{ marginRight: "5px" }} />
              SAVE
            </AppButton>
            <AppButton
              onClick={cancelSave}
              variant="secondary"
              style={{ minWidth: "100px" }}
            >
              <IoMdClose style={{ marginRight: "5px" }} />
              CANCEL
            </AppButton>
          </div>
        ) : null}
      </form>
    </>
  );
};

export default EditorForm;
