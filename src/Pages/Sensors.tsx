import { useEffect, useState } from "react";
import { Button, Collapse, Switch, Table, notification } from "antd";
import PlayCircleOutlined from "@ant-design/icons/lib/icons/PlayCircleOutlined";

import { capitalize, updateRecord } from "../common";
import door from "../assets/door.png";
import appliance from "../assets/appliance.png";

const { Panel } = Collapse;

const Sensors = (props) => {
  const [apps, setApps] = useState(props.apps);
  const [doorsAndWindows, setDoorsAndWindows] = useState(props.doorsAndWindows);
  const { sims } = props;

  useEffect(() => {
    setApps(props.apps);
    setDoorsAndWindows(props.doorsAndWindows);
  }, [props]);

  const handleToggle = (type, record, checked) => {
    const id = record?.id;
    if (type === "appliance") {
      const newApps = [...apps];

      const index = newApps.findIndex((app) => app.id === id);
      newApps[index] = { ...record, isOn: checked };

      setApps(newApps);
    } else {
      const newDW = [...doorsAndWindows];

      const index = newDW.findIndex((dw) => dw.id === id);
      newDW[index] = { ...record, isOpen: checked };

      setDoorsAndWindows(newDW);
    }

    updateRecord(type, record, checked);
  };

  const setSimModal = (simName = undefined) => {
    console.log(simName);
    if (simName) {
      notification.open({
        message: `${capitalize(simName)} Simulation Results`,
        description: JSON.stringify(sims[simName]),
        icon: <PlayCircleOutlined />,
      });
    }
  };

  const applianceCols = [
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      sorter: (a, b) => {
        if (a.room < b.room) return -1;
        if (a.room > b.room) return 1;
        return 0;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: "Toggle On/Off",
      dataIndex: "toggle",
      key: "toggle",
      editable: true,
      render: (_, record) => {
        return (
          <Switch
            key={record.id}
            defaultChecked={
              apps[apps.findIndex((app) => app.id === record.id)]?.isOn
            }
            onChange={(checked) => handleToggle("appliance", record, checked)}
          />
        );
      },
    },
    {
      title: "Power Use",
      dataIndex: "power_use",
      key: "power_use",
      sorter: (a, b) => a.power_use - b.power_use,
    },
  ];
  const doorsAndWindowsCols = [
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a.room < b.room) return -1;
        if (a.room > b.room) return 1;
        return 0;
      },
    },
    {
      title: "Toggle Open/Closed",
      dataIndex: "toggle",
      key: "toggle",
      editable: true,
      render: (_, record) => {
        return (
          <Switch
            key={record.id}
            defaultChecked={
              doorsAndWindows[
                doorsAndWindows.findIndex((dw) => dw.id === record.id)
              ]?.isOpen
            }
            onChange={(checked) => handleToggle("door/window", record, checked)}
          />
        );
      },
    },
  ];
  const simCols = [
    { title: "Title", key: "sim" },
    {
      title: "Run",
      dataIndex: "button",
      key: "button",
      render: (_, record) => {
        return (
          <Button
            value={record}
            type="primary"
            size="large"
            key={`${record}-button`}
            icon={<PlayCircleOutlined />}
            onClick={(e) => {
              console.log(e);
              setSimModal((e.target as HTMLButtonElement).value);
            }}
            style={{ width: "50%", textAlign: "center" }}
          >
            Run
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ marginTop: "45px" }}>
        <Collapse>
          <Panel header="Appliances" key="apps">
            <Table
              key="apps-table"
              columns={applianceCols}
              dataSource={apps}
              pagination={false}
              loading={apps?.length === 0}
            />
          </Panel>
          <Panel header="Doors and Windows" key="doors_windows">
            <Table
              key="dw-table"
              columns={doorsAndWindowsCols}
              dataSource={doorsAndWindows}
              pagination={false}
              loading={apps?.length === 0}
            />
          </Panel>
          <Panel header="Simulations" key="sims">
            <Table
              key="sim-table"
              columns={simCols}
              dataSource={Object.keys(sims)}
              pagination={false}
            />
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Sensors;
