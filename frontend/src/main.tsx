import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { RouterProvider } from "react-router-dom";
import StoreProvider from "./store/StoreProvider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import routes from "./router";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <StoreProvider>
            <RouterProvider router={routes} />
        </StoreProvider>
    </StrictMode>
);
