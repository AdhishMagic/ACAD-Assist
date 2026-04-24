import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppRoutes } from "@/routes";
import { authAPI } from "@/features/auth/services/authAPI";
import { logout, setActiveRole, syncAuthFromStorage, updateCurrentUser } from "@/features/auth/store/authSlice";
import { normalizeRole } from "@/features/auth/utils/role";
import { queryClient } from "@/shared/lib/query/queryClient";

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem("access_token") || localStorage.getItem("token");

    if (!storedToken) {
      dispatch(syncAuthFromStorage());
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    authAPI
      .me()
      .then((user) => {
        if (!isMounted) return;

        dispatch(updateCurrentUser(user));
        dispatch(syncAuthFromStorage());

        const resolvedRole = normalizeRole(user?.role);
        if (resolvedRole) {
          dispatch(setActiveRole(resolvedRole));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        dispatch(logout());
        queryClient.clear();
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (!isReady) {
    return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;
  }

  return children;
}

function App() {
  return (
    <AuthBootstrap>
      <AppRoutes />
    </AuthBootstrap>
  );
}

export default App;
