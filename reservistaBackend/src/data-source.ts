import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "umar",
  password: "umar",
  database: "reservista_clean",
  synchronize: false, // Disabled to avoid schema conflicts
  logging: false,
  entities: ["dist/src/entities/**/*.js"],
  migrations: ["dist/src/migrations/**/*.js"],
  subscribers: ["dist/src/subscribers/**/*.js"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
