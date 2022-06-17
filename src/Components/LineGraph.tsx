import { Line } from "@ant-design/charts";
import { Select } from "antd";

const { Option } = Select;

const LineGraph = (props) => {
  const graphConfig = {
    data: props.graphData,
    autoFit: true,
    xField: "date",
    yField: "cost",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    seriesField: "category",
    color:
      props.month === "current"
        ? [
            "#1979C9",
            "#D62A0D",
            "#FAA219",
            "#9932CC",
            "#BA55D3",
            "#DA70D6",
            "#50C878",
          ]
        : ["#1979C9", "#D62A0D", "#FAA219", "#50C878"],
  };

  return (
    <div style={{ marginTop: "50px", padding: "0 20px" }}>
      <Line {...graphConfig} />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          margin: "50px",
          zIndex: 20,
        }}
      >
        <Select
          style={{ width: "9vw" }}
          value={props.month}
          onChange={(e) => {
            props.setMonth(e as string);
          }}
        >
          <Option value="current" key="current">
            current
          </Option>
          <Option value="1month" key="1month">
            1 month ago
          </Option>
          <Option value="2month" key="2month">
            2 months ago
          </Option>
        </Select>
      </div>
    </div>
  );
};

export default LineGraph;
