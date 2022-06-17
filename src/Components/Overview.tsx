import { Card, List, Statistic, Avatar } from "antd";
import { capitalize } from "../common";
import water from "../assets/water.png";
import power from "../assets/power.png";
import money from "../assets/money.png";
import { useEffect } from "react";

const { Meta } = Card;

const Overview = (props) => {
  const { data, predictionData } = props;
  const pred = Object.keys(predictionData).length > 0;

  return (
    <>
      <List
        style={{ marginTop: "5px", padding: "20px" }}
        grid={{
          gutter: 16,
          column: 3,
        }}
        dataSource={Object.keys(data)}
        renderItem={(item) => {
          return (
            <List.Item>
              <Card size={item === "cost" ? "small" : "default"}>
                {item === "cost" ? (
                  <Meta
                    avatar={<Avatar size={110} src={money} />}
                    title="Total Cost"
                    description={`$${data["cost"]}${
                      pred
                        ? ` (+ $${predictionData["cost"]} = $${
                            data["cost"] + predictionData["cost"]
                          })`
                        : ""
                    }`}
                  />
                ) : (
                  <Meta
                    avatar={
                      <Avatar
                        size={110}
                        src={item === "water" ? water : power}
                      />
                    }
                    title={capitalize(item)}
                    description={
                      <>
                        <p>{`${data[item].amount} ${
                          pred
                            ? `(+ ${predictionData[item].amount} = ${
                                data[item].amount + predictionData[item].amount
                              })`
                            : ""
                        } ${item === "water" ? "gallons" : "kilowatts"}`}</p>
                        <p>{`$${data[item].cost}${
                          pred
                            ? ` (+ $${predictionData[item].cost} = $${
                                data[item].cost + predictionData[item].cost
                              })`
                            : ""
                        }`}</p>
                      </>
                    }
                  />
                )}
              </Card>
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Overview;
