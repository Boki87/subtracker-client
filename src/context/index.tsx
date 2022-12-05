import { ReactNode } from "react";
import UserContext, { useUserContext } from "./UserContext";
import NavigationContext, { useNavigationContext } from "./NavigationContext";
import SubscriptionContext, {
  useSubscriptionContext,
} from "./SubscriptionContext";
import ModalsContext, { useModalsContext } from "./ModalsContext";

export {
  useUserContext,
  useNavigationContext,
  useSubscriptionContext,
  useModalsContext,
};

const CombinedContext = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext>
      <ModalsContext>
        <NavigationContext>
          <SubscriptionContext>{children}</SubscriptionContext>
        </NavigationContext>
      </ModalsContext>
    </UserContext>
  );
};

export default CombinedContext;
