import { expect } from "chai";
import { setupGlobal } from "./global";
import { ClassInputModel } from "../src/database/models";
import { PrincipalTime } from "../src/time";
import { withoutObjectId } from "./utils";

declare const global: typeof setupGlobal;

describe("Database", async () => {
  it("check if database exists", async () => {
    const database = global.database;
    expect(database).to.not.be.undefined;
  });

  describe("Server Settings", async () => {
    it("write and read to database", async () => {
      const database = global.database;

      await database.setServerSetting("enabled", true, "test");
      expect(await database.getServerSetting("enabled", "test")).to.be.true;
    });
  });

  describe("Classes", async () => {
    it("write and read to database", async () => {
      const database = global.database;

      const entry: ClassInputModel = {
        className: "test class",
        studentId: "test student",
        datetime: new PrincipalTime(new Date()).offset({ days: 1 }).date,
        serverId: "test",
      };

      await database.createClass(entry);

      const classes = await database.getClasses("test");

      expect(classes).to.be.an("array");
      expect(classes).to.have.lengthOf(1);

      const [classDbEntry] = classes;
      const classEntry = withoutObjectId(classDbEntry);

      expect(classEntry).to.deep.equal(entry);
    });
  });
});
