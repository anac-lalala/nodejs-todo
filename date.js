exports.getDate = function () {
  const today = new Date();
  return today.toLocaleString("en-us", { weekday: "long" });
};
