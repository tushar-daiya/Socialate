import { app } from "./app.js";
import connectDb from "./configs/dbConfig.js";

const port=process.env.PORT || 8000;
connectDb();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });