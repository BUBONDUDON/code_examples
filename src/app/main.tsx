import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ConfigProvider, theme } from "antd";
import { TasksProvider } from "@/shared/model/tasks.tsx";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Jura",
          borderRadius: 12,
        },
        algorithm: theme.defaultAlgorithm,
        components: {
          Card: { borderRadiusLG: 16 },
          Button: { borderRadius: 12 },
        },
      }}
    >
      <TasksProvider>
        <RouterProvider router={router} />
      </TasksProvider>
    </ConfigProvider>
  </StrictMode>
);
