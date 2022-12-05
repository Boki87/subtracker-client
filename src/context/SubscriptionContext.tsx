import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Subscription } from "../types/Subscription";
import appFetch from "../utils/appFetch";
import { useNavigationContext, useUserContext } from "../context";
import { useModalsContext } from "./";

interface IniitialSubscriptionContextInterface {
  activeSubscription: Subscription | null;
  subscriptions: Subscription[];
  isSubEditorOpen: boolean;
  isSubEditorToggable: boolean;
  openSubEditor: () => void;
  closeSubEditor: () => void;
  inSelectMode: boolean;
  selectedSubscriptions: string[];
  setSelectedSubscriptions: (arr: string[]) => void;
  deleteSelectedSubscriptionsHandler: () => void;
  deleteSingleSubscription: (id: string) => void;
  addSelectedSubscription: (id: string) => void;
  removeSelectedSubscription: (id: string) => void;
  activateSelectMode: () => void;
  deactivateSelectMode: () => void;
  listMode: "base" | "select" | "search";
  setListMode: (mode: "base" | "select" | "search") => void;
  updateSingleSubscription: (data: Subscription) => void;
  isUpdatingSubscriptions: boolean;
  addNewSub: () => void;
}

const initialState: IniitialSubscriptionContextInterface = {
  activeSubscription: null,
  subscriptions: [],
  isSubEditorOpen: true,
  isSubEditorToggable: false,
  openSubEditor: () => {},
  closeSubEditor: () => {},
  inSelectMode: false,
  selectedSubscriptions: [],
  setSelectedSubscriptions: () => {},
  deleteSelectedSubscriptionsHandler: () => {},
  deleteSingleSubscription: () => {},
  addSelectedSubscription: () => {},
  removeSelectedSubscription: () => {},
  activateSelectMode: () => {},
  deactivateSelectMode: () => {},
  listMode: "base",
  setListMode: () => {},
  updateSingleSubscription: () => {},
  isUpdatingSubscriptions: false,
  addNewSub: () => {},
};

const subscriptionContext = createContext(initialState);
export const useSubscriptionContext = () => useContext(subscriptionContext);

const SubscriptionContext = ({ children }: { children: ReactNode }) => {
  const { confirmModal } = useModalsContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const { navItems, setNavItems } = useNavigationContext();
  const { user } = useUserContext();

  const [activeSubscription, setActiveSubscription] =
    useState<null | Subscription>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isSubEditorOpen, setIsSubEditorOpen] = useState(true);
  const [isSubEditorToggable, setIsSubEditorToggable] = useState(false);
  const [inSelectMode, setInSelectMode] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    []
  );

  const [listMode, setListMode] = useState<"base" | "search" | "select">(
    "base"
  );

  const [isUpdatingSubscriptions, setIsUpdatingSubscriptions] = useState(false);

  function openSubEditor() {
    if (isSubEditorToggable) {
      setIsSubEditorOpen(true);
    }
  }

  function closeSubEditor() {
    if (isSubEditorToggable) {
      setIsSubEditorOpen(false);
    }
  }

  function activateSelectMode() {
    setInSelectMode(true);
  }

  function deactivateSelectMode() {
    setInSelectMode(false);
    setSelectedSubscriptions([]);
  }

  function setNavigationCount(subs: Subscription[]) {
    const allSubscriptions = subs.length;
    const recentSubs = subs.filter((s) => {
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
    }).length;

    const favorites = subs.filter((s) => s.isFavorite).length;

    const navItemsCopy = navItems.map((item) => {
      if (item.name === "") {
        item.count = allSubscriptions;
      }
      if (item.name === "recently_added") {
        item.count = recentSubs;
      }

      if (item.name === "favorites") {
        item.count = favorites;
      }
      return item;
    });
    setNavItems(navItemsCopy);
  }

  async function fetchSubscriptions() {
    try {
      const subscriptionsRes = await appFetch("/subscriptions");
      if (subscriptionsRes.success) {
        setSubscriptions(subscriptionsRes.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function addSelectedSubscription(id: string) {
    if (!selectedSubscriptions.includes(id)) {
      setSelectedSubscriptions([...selectedSubscriptions, id]);
    }
  }

  function removeSelectedSubscription(id: string) {
    const newSubs = selectedSubscriptions.filter((s) => s !== id);
    setSelectedSubscriptions(newSubs);
  }

  async function deleteSelectedSubscriptions() {
    try {
      const res = await appFetch("/subscriptions", {
        method: "DELETE",
        body: JSON.stringify({ subscriptions: selectedSubscriptions }),
      });
      if (res.success) {
        const subscriptionsCopy = subscriptions.filter((s) => {
          if (!selectedSubscriptions.includes(s.id)) {
            return s;
          }
        });
        setSubscriptions(subscriptionsCopy);
        setSelectedSubscriptions([]);
        searchParams.set("sub", "");
        setActiveSubscription(null);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteSingleSubscription(id: string) {
    const res = await confirmModal.openConfirmModal(
      "Are you sure you want to delete this subscription?"
    );

    if (!res) return;

    try {
      const res = await appFetch(`/subscriptions/${id}`, { method: "DELETE" });
      if (!res.success) throw Error("Could not delte subscription");
      setSubscriptions((old) => {
        return old.filter((i) => i.id !== id);
      });
      searchParams.set("sub", "");
      setActiveSubscription(null);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteSelectedSubscriptionsHandler() {
    if (selectedSubscriptions.length === 0) return;
    const res = await confirmModal.openConfirmModal(
      "Are you sure you want to delete these seleced subscriptions?"
    );
    console.log(res);
    if (res) {
      deleteSelectedSubscriptions();
    }
  }

  async function updateSingleSubscription(data: Subscription) {
    try {
      setIsUpdatingSubscriptions(true);
      const res = await appFetch(`/subscriptions/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.success) throw Error("Could not update subscription");
      const subscriptionsCopy = subscriptions.map((s) => {
        if (s.id === data.id) {
          return res.data;
        } else {
          return s;
        }
      });
      setSubscriptions(subscriptionsCopy);
      setIsUpdatingSubscriptions(false);
    } catch (e) {
      console.log(e);
      setIsUpdatingSubscriptions(false);
    }
  }

  async function addNewSub() {
    try {
      const now = new Date();
      const y = now.toLocaleString("default", { year: "numeric" });
      const m = now.toLocaleString("default", { month: "2-digit" });
      const d = now.toLocaleString("default", { day: "2-digit" });
      const date = `${y}-${m}-${d}`;
      const genericSub = {
        name: "Change me",
        cost: 1,
        currency: user?.defaultCurrency || "EUR",
        firstBill: date,
      };
      const res = await appFetch(`/subscriptions`, {
        method: "POST",
        body: JSON.stringify(genericSub),
      });
      if (!res.success) throw Error("Could not add new subscription");
      const newSub = res.data;
      setSubscriptions([newSub, ...subscriptions]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setNavigationCount(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    if (searchParams.get("sub")) {
      const subId = searchParams.get("sub");
      const activeSub = subscriptions.filter((s) => s.id === subId)[0];

      if (activeSub) {
        setActiveSubscription(activeSub);
      }
      openSubEditor();
    } else {
      setActiveSubscription(null);
      closeSubEditor();
    }
  }, [searchParams.get("sub"), subscriptions]);

  useEffect(() => {
    function onWinResize() {
      if (window.innerWidth < 700) {
        setIsSubEditorOpen(false);
        setIsSubEditorToggable(true);
      } else {
        setIsSubEditorOpen(true);
        setIsSubEditorToggable(false);
      }
    }

    fetchSubscriptions();
    onWinResize();

    window.addEventListener("resize", onWinResize);

    return () => window.removeEventListener("resize", onWinResize);
  }, [user]);

  return (
    <subscriptionContext.Provider
      value={{
        activeSubscription,
        subscriptions,
        isSubEditorOpen,
        isSubEditorToggable,
        openSubEditor,
        closeSubEditor,
        inSelectMode,
        selectedSubscriptions,
        setSelectedSubscriptions,
        deleteSelectedSubscriptionsHandler,
        deleteSingleSubscription,
        addSelectedSubscription,
        removeSelectedSubscription,
        activateSelectMode,
        deactivateSelectMode,
        listMode,
        setListMode,
        updateSingleSubscription,
        isUpdatingSubscriptions,
        addNewSub,
      }}
    >
      {children}
    </subscriptionContext.Provider>
  );
};

export default SubscriptionContext;
