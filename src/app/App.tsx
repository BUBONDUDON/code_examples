import { AppHeader } from "@/features/header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Outlet />
    </Layout>
  );
}

export default App;
