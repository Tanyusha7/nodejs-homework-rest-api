const app = require("./app");
////-----

const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://Tanya:aRtS5-jsLM4_qM7@cluster0.glkrgak.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// , () => {
//   console.log("Server running. Use our API on port: 3000");
// });
