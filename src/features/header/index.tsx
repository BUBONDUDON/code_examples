import { ROUTES } from "@/shared/model/routes";
import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

export const AppHeader = () => {
  return (
    <Header style={{ height: "100px", borderRadius: "20px" }}>
      <Typography.Title
        level={2}
        style={{
          color: "white",
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <Link to={ROUTES.HOME}>Task manager</Link>
      </Typography.Title>
    </Header>
  );
};
