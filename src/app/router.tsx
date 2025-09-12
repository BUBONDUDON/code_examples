import { createBrowserRouter, redirect } from "react-router-dom";
import { ROUTES } from "../shared/model/routes";
import App from "./App";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.TASKS,
        lazy: () => import("@/features/task-feature/tasks-list-page/Tasks.page"),
      },
      {
        path: ROUTES.TASK,
        lazy: () => import("@/features/task-feature/task-page/Task.page"),
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.TASKS),
      },
    ],
  },
]);
