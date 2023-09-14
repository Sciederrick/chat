const request = require("supertest");
const app = require("../../../app");
const { createRandomString } = require("../../../src/v1/util/helper.util");

describe("health check controller", () => {
  it("test / endpoint (health check)", async () => {

    const response = await request(app)
      .get("/api/v1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("ok");
  }, 20_000);
});
