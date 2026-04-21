import dotenv from "dotenv";

dotenv.config();

export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT || 5001),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "",
};
