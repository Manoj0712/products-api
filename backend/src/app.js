import cors from "cors";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerDefinition } from "./docs/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ["./src/routes/*.js"]
});

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl
    })
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      message: "SuperLabs Product Service API",
      docs: "/api/docs"
    });
  });

  app.use("/api", productRoutes);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(errorHandler);

  return app;
}
