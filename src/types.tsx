type Appliance = {
  id: number;
  name: string;
  room: string;
  power_use: number;
  isOn: boolean;
};

type DoorsAndWindows = {
  id: number;
  name: string;
  room: string;
  isOpen: boolean;
};

type Thermostat = {
  unit: "celcius" | "farenheit";
  outdoorTemp: number;
  indoorTemp: number;
  temp: number;
};

export type { Appliance, DoorsAndWindows, Thermostat };
