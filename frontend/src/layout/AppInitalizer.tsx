import { setAuthenticateEmployeeDetailsData } from "@/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLazyAuthMeQuery } from "@/api/api";

export default function AppInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();
    const [triggerAuthMe] = useLazyAuthMeQuery();

    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            triggerAuthMe()
                .unwrap()
                .then((res) => {
                    dispatch(setAuthenticateEmployeeDetailsData(res));
                })
                .catch(() => {
                    // invalid refresh token -> clear localStorage + state
                    localStorage.removeItem("refreshToken");
                    dispatch(setAuthenticateEmployeeDetailsData(null));
                });
        }
    }, [dispatch, triggerAuthMe]);

    return <>{children}</>;
}
