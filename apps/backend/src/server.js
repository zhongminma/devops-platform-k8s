import { app } from "./app.js";
import { connectToDatabase } from "./database.js";

const port = Number(process.env.PORT || 8080);

await connectToDatabase();

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});
