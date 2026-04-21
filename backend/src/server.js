import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrapStore } from "./services/productStore.js";

async function startServer() {
  await bootstrapStore();
  const app = createApp();
  const PORT = env.port;

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
};

startServer();
