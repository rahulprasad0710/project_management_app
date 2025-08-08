import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { RouterProvider } from "react-router-dom";
import StoreProvider from "./store/StoreProvider.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
// import contextClass from "./constant/toastCss.ts";
import { createRoot } from "react-dom/client";
import routes from "./router/routes.tsx";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <StoreProvider>
            <RouterProvider router={routes} />
        </StoreProvider>
        <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar
        />
    </ThemeProvider>
);
