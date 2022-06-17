import { Link } from "react-router-dom";
import { Menu, Image } from "antd";

import logo from "../assets/logo.png";

const MainPage = () => {
  // const [path, setPath] = useState("dashboard");

  // const handleClick = (e) => {
  //   setPath(e.key);
  // };

  return (
    <>
      <Menu
        mode="horizontal"
        style={{ position: "fixed", top: 0, width: "100vw", zIndex: 10 }}
      >
        <Menu.Item key="dashboard">
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="metrics">
          <Link to="/metrics">Metrics</Link>
        </Menu.Item>
        <Menu.Item key="sensors">
          <Link to="/sensors">Sensors</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default MainPage;
