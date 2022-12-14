import css from "./SubscriptionEditor.module.css";
import { useSubscriptionContext } from "../../../context";
import EditorForm from "./EditorForm";
import SettingsPanel from "../../app/SettingsPanel";

const SubscriptionEditor = () => {
  const { isSubEditorOpen } = useSubscriptionContext();

  return (
    <div
      className={
        isSubEditorOpen ? `${css.sub_editor} ${css.active}` : css.sub_editor
      }
    >
      <EditorForm />

      <SettingsPanel />
    </div>
  );
};

export default SubscriptionEditor;
