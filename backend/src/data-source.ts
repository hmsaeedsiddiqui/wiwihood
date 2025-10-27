import { DataSource } from "typeorm";
import { config } from 'dotenv';
import * as entities from './entities';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "postgres",
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: true, // Enable for auto table generation in development
  logging: true,
  // Filter exported module values to only include class constructors (entity classes).
  // This avoids passing enums or plain objects (like enum exports) to TypeORM which
  // expects classes / EntitySchema instances.
  entities: Object.values(entities).filter((e) => typeof e === 'function'),
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
