import app from "./app.js";
import connectDB from "./db/db.js";
import { PORT } from "./utils/env.js";


connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  })
})
.catch((error) => {
  console.log(`Error connecting to database: ${error.message}`);
  process.exit(1);
})

