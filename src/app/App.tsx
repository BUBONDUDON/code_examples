import { AppHeader } from "@/features/header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Layout>
      <AppHeader />
      <Outlet />
    </Layout>
  );
}

export default App;
