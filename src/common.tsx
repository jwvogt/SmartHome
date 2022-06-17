const devURL = "http://localhost:5000";
const c_to_f = (temp: number) => {
  // Convert Celcius to Farenheit
  return Math.round(temp * (9 / 5) + 32);
};

const f_to_c = (temp: number) => {
  // Convert Farenheit to Celcius
  return Math.round((temp - 32) * (5 / 9));
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const updateRecord = (type, record, checked = undefined) => {
  if (Object.keys(record).length === 0) return;
  fetch(`${devURL}/api/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      type,
      record,
      checked,
    }),
  }).catch((error) => console.log(error));
};

export { c_to_f, f_to_c, devURL, capitalize, updateRecord };
