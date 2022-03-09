import { openBrowser, goto, text, closeBrowser, click, currentURL, screenshot } from "taiko";
import { Server } from "http";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { makeApp } from "../../src/server";

dotenv.config();

jest.setTimeout(50000);

let server: Server;
let mongoClient: MongoClient;
const databaseUrl: string = process.env.MONGO_URL || "";

beforeAll(async () => {
  await openBrowser({
    args: [
      "--window-size=1440,1000",
      "--no-sandbox",
      "--start-maximized",
      "--disable-dev-shm",
    ],
    headless: true,
    observe: false,
    observeTime: 2000,
  });
});

beforeEach(async () => {
  return await MongoClient.connect(databaseUrl).then(async (client) => {
    mongoClient = client;
    const db = mongoClient.db();

    server = makeApp(db).listen(3030);
  });
});

afterEach(async () => {
  await mongoClient.close();
  server.close();
});

afterAll(async () => {
  await closeBrowser();
});

test("Test that we have an index with an h1 and an image of a phoenix", async () => {
  expect.assertions(2);

  await goto("http://localhost:3030");

  const myH1 = text("This should be changed in the first PR");

  expect(await myH1.exists()).toBe(true);

  await click(text("Link"));

  expect(await currentURL()).toContain("/plop");
  expect(false).toBe(true);
});
