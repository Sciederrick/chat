const request = require("supertest");
const app = require("../../../app");
const db = require("../../../mongo/db")
const { createRandomString } = require("../../../src/v1/util/helper.util");

describe("codepad controller", () => {
  beforeAll(async () => {
    await db.init(() => {});
  });

  it("test /codepads endpoint", async () => {
    const codeResource = {
      userId: createRandomString(12),
      code: "# This is a comment",
    };

    const response = await request(app)
      .post("/api/v1/codepads")
      .send(codeResource)
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
    expect(response.body.userId).toEqual(codeResource.userId);
  }, 20_000);

});
