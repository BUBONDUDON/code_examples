import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  TASKS: "/tasks",
  TASK: "/tasks/:taskId",
} as const;

export type PathParams = {
  [ROUTES.TASK]: {
    taskId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
