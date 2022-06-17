import { Button, Statistic, Row, Col, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import thermostat from "../assets/thermostat.png";

const Thermostat = (props) => {
  const { thermData } = props;
  const { outsideTemp, insideTemp, temp } = thermData;

  return (
    <div
      style={{
        display: "inline",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "65%",
        height: "20%",
      }}
    >
      <Row justify="start" style={{ margin: "20px 5px 0 30px" }}>
        <Col span={4}>
          <Image
            preview={false}
            src={thermostat}
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Outside"
            value={outsideTemp}
            suffix={"°C"}
            style={{ textAlign: "center" }}
          />
        </Col>

        <Col span={4}>
          <Statistic
            title="Inside"
            value={insideTemp}
            suffix={"°C"}
            style={{ textAlign: "center" }}
          />
        </Col>

        <Col span={12}>
          <Button
            size="large"
            icon={<LeftOutlined />}
            style={{ float: "left", margin: "25px 50px" }}
            onClick={() => {
              props.setThermData({
                ...thermData,
                temp: temp - 1,
              });
            }}
          />
          <Statistic
            title="Set"
            value={temp}
            suffix={"°C"}
            style={{ textAlign: "center", float: "left" }}
          />
          <Button
            size="large"
            icon={<RightOutlined />}
            style={{ float: "left", margin: "25px 50px" }}
            onClick={() => {
              props.setThermData({
                ...thermData,
                temp: temp + 1,
              });
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export { Thermostat };
