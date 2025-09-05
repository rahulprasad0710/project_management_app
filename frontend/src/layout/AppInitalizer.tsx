import Spinner2 from "@/components/atoms/Spinner2";
import { setAuthenticateEmployeeDetailsData } from "@/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLazyGetUserAuthenticatedQuery } from "@apiHooks/useAuthUser";

export default function AppInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();
    const [authenticateMe, { isFetching }] = useLazyGetUserAuthenticatedQuery();

    const handleLogout = () => {
        dispatch(setAuthenticateEmployeeDetailsData(null));
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            authenticateMe()
                .unwrap()
                .then((res) => {
                    if (res?.data && res?.success) {
                        dispatch(
                            setAuthenticateEmployeeDetailsData(
                                res?.data || null
                            )
                        );
                    } else {
                        handleLogout();
                    }
                })
                .catch(() => {
                    handleLogout();
                });
        } else {
            handleLogout();
        }
    }, [dispatch, authenticateMe]);

    return <>{isFetching ? <Spinner2 /> : children}</>;
}
