const app = require("./app");
const { config } = require("./config/env");

app.listen(config.port, () => {
  console.log(`ImpoExpo Connect API listening on port ${config.port}`);
});
