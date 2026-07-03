import "dotenv/config";
import { createApp } from "./app.js";

const PORT = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(PORT, () => {
  console.log(`Skywalkers backend listening on http://localhost:${PORT}`);
  console.log(`Allowing requests from: ${process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"}`);
});
