import assert from "assert";
import { PrincipalTime } from "../src/time";

describe("PrincipalTime", () => {
  it("test toString method on PrincipalTime", () => {
    const date = new Date("2021-01-01 00:00:00");
    const principalTime = new PrincipalTime(date);

    const expected = "2021. 01. 01. 0:00:00";
    const actual = String(principalTime);

    assert.equal(actual, expected);
  });

  it("test offset method forwards on PrincipalTime", () => {
    const date = new Date("2020-12-31 23:59:00");
    const principalTime = new PrincipalTime(date);

    const expected = "2021. 01. 01. 0:00:00";
    const actual = String(principalTime.offset({ minutes: 1 }));

    assert.equal(actual, expected);
  });

  it("test offset method backwards on PrincipalTime", () => {
    const date = new Date("2021-01-01 00:00:00");
    const principalTime = new PrincipalTime(date);

    const expected = "2020. 12. 31. 23:59:00";
    const actual = String(principalTime.offset({ minutes: -1 }));

    assert.equal(actual, expected);
  });
});
