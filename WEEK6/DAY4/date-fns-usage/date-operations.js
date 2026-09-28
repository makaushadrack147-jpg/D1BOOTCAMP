const { addDays, format } = require("date-fns");

function displayDateFiveDaysFromNow() {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, 5);
  console.log(`Date in five days: ${format(futureDate, "yyyy-MM-dd HH:mm:ss")}`);
}

module.exports = displayDateFiveDaysFromNow;
