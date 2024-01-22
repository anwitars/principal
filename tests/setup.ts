import { register } from "ts-node";

register({
  project: "tests/tsconfig.json",
});

export class TestClass {
  invokeCount: number;

  constructor() {
    this.invokeCount = 0;
  }

  public invoke(): number {
    return ++this.invokeCount;
  }
}

export async function mochaGlobalSetup(): Promise<void> {}
