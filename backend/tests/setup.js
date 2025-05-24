const mongoose = require("mongoose");
const { app, startServer } = require("../index");

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        console.log("Server closed");
        resolve();
      });
    });
  }
});
