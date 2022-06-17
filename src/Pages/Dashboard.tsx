import React from "react";
import { Layout } from "antd";
import Floorplan from "../Components/Floorplan";

import { Thermostat } from "../Components/Thermostat";

const Dashboard = (props) => {
  // TODO: add floorplan stuff here
  const { apps, doorsAndWindows, therm } = props;
  return (
    <div style={{ marginTop: "10px" }}>
      <Floorplan
        apps={apps}
        doorsAndWindows={doorsAndWindows}
        setApps={props.setApps}
        setDoorsAndWindows={props.setDoorsAndWindows}
      />

      <Thermostat thermData={therm} setThermData={props.setTherm} />
    </div>
  );
};

export { Dashboard };
