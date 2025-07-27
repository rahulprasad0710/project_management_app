import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { RouterProvider } from "react-router-dom";
import StoreProvider from "./store/StoreProvider.tsx";
import { StrictMode } from "react";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { createRoot } from "react-dom/client";
import routes from "./router";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <StoreProvider>
                <RouterProvider router={routes} />
            </StoreProvider>
        </ThemeProvider>
    </StrictMode>
);
