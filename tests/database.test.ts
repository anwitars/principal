import { expect } from "chai";
import { setupGlobal } from "./global";
import { ClassModelInput } from "../src/database/models";
import { PrincipalTime } from "../src/time";
import { withoutObjectId } from "./utils";

declare const global: typeof setupGlobal;

const defaultTime = new PrincipalTime(new Date());
const toDeleteTime = defaultTime.offset({ days: 1 });

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
    it("create and get classes", async () => {
      const database = global.database;

      const doNotDelete: ClassModelInput = {
        className: "test class",
        studentId: "test student",
        datetime: defaultTime.date,
        serverId: "test",
      };

      const toDelete: ClassModelInput = {
        className: "to be deleted",
        studentId: "test student",
        datetime: toDeleteTime.date,
        serverId: "test",
      };

      await database.createClass(doNotDelete);
      await database.createClass(toDelete);

      const classes = await database.getClasses("test", { filter: { studentId: "test student" } });

      expect(classes).to.be.an("array");
      expect(classes).to.have.lengthOf(2);

      const classEntries = classes.map(withoutObjectId);

      expect(classEntries).to.deep.include(doNotDelete);
    });

    it("delete class", async () => {
      const database = global.database;

      const deleteResult = await database.deleteClass({ studentId: "test student", datetime: toDeleteTime.date });

      expect(deleteResult).to.be.true;

      const classes = await database.getClasses("test", { filter: { studentId: "test student" } });

      expect(classes).to.be.an("array");
      expect(classes).to.have.lengthOf(1);

      const [classEntry] = classes;

      expect(classEntry.className).to.equal("test class");
      expect(classEntry.datetime).to.deep.equal(defaultTime.date);
    });

    it("delete non-existing class", async () => {
      const database = global.database;

      const classesNumberBefore = (await database.getClasses("test")).length;

      // does not exist anymore
      const deleteResult = await database.deleteClass({ studentId: "test student", datetime: toDeleteTime.date });

      expect(deleteResult).to.be.false;

      const classesNumberAfter = (await database.getClasses("test")).length;

      expect(classesNumberAfter).to.equal(classesNumberBefore);
    });
  });
});
