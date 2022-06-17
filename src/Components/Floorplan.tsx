import React, { useEffect } from "react";
import { Collapse, Image, Menu, List, Radio } from "antd";

import floorplan from "../assets/floorplan.png";
import { updateRecord } from "../common";

const Floorplan = (props) => {
  const { apps, doorsAndWindows } = props;

  const rooms = [];

  apps.map((app) => {
    if (!rooms.includes(app.room)) rooms.push(app.room);
  });
  doorsAndWindows.map((dw) => {
    if (!rooms.includes(dw.room)) rooms.push(dw.room);
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "75%",
        position: "relative",
      }}
    >
      <Image
        preview={false}
        src={floorplan}
        alt="floorplan"
        style={{ maxWidth: "800px", maxHeight: "600px" }}
      />
      <Collapse
        accordion
        style={{
          position: "absolute",
          right: 0,
          top: 30,
          width: "35%",
          height: "100vh",
          overflow: "auto",
        }}
        defaultActiveKey={["sensors"]}
      >
        <Collapse.Panel key="sensors" header="Sensors">
          <Collapse>
            {rooms.map((room) => {
              return (
                <Collapse.Panel key={room} header={room}>
                  <Collapse>
                    <Collapse.Panel key={room + "_dw"} header="Doors/Windows">
                      <List
                        itemLayout="vertical"
                        dataSource={doorsAndWindows.filter((dw) => {
                          return dw.room === room;
                        })}
                        renderItem={(item: {
                          id: number;
                          name: string;
                          isOpen: boolean;
                        }) => {
                          return (
                            <div
                              key={`${room}_dw_${item.id}`}
                              style={{
                                width: "100%",
                                display: "inline-block",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                style={{
                                  textAlign: "left",
                                  marginRight: "25px",
                                }}
                              >
                                {item.name}
                              </label>
                              <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                options={[
                                  { label: "Closed", value: false },
                                  { label: "Open", value: true },
                                ]}
                                defaultValue={
                                  doorsAndWindows[
                                    doorsAndWindows.findIndex(
                                      (dw) => dw.id === item.id
                                    )
                                  ].isOpen
                                }
                                onChange={(e) =>
                                  updateRecord(
                                    "door/window",
                                    {
                                      ...item,
                                      isOpen: e.target.value,
                                    },
                                    e.target.value
                                  )
                                }
                                style={{ float: "right", textAlign: "right" }}
                              />
                            </div>
                          );
                        }}
                      />
                    </Collapse.Panel>
                    <Collapse.Panel key={room + "_apps"} header="Appliances">
                      <List
                        itemLayout="vertical"
                        dataSource={apps.filter((dw) => {
                          return dw.room === room;
                        })}
                        renderItem={(item: {
                          id: number;
                          name: string;
                          isOn: boolean;
                        }) => {
                          return (
                            <div
                              key={`${room}_app_${item.id}`}
                              style={{
                                width: "100%",
                                display: "inline-block",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                style={{
                                  textAlign: "left",
                                  marginRight: "25px",
                                }}
                              >
                                {item.name}
                              </label>
                              <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                options={[
                                  { label: "Off", value: false },
                                  { label: "On", value: true },
                                ]}
                                defaultValue={
                                  apps[
                                    apps.findIndex((app) => app.id === item.id)
                                  ].isOn
                                }
                                onChange={(e) =>
                                  updateRecord(
                                    "appliance",
                                    {
                                      ...item,
                                      isOn: e.target.value,
                                    },
                                    e.target.value
                                  )
                                }
                                style={{ float: "right", textAlign: "right" }}
                              />
                            </div>
                          );
                        }}
                      />
                    </Collapse.Panel>
                  </Collapse>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default Floorplan;
