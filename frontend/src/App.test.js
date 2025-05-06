import * as services from "./utils/services";

describe("Services", () => {
  describe("saveToLocalStorage", () => {
    test("save string value to local storage", () => {
      const key = "example";
      services.saveToLocalStorage(key, "1");
      expect(localStorage.getItem(key)).toBe("1");
    });

    test("stringify object and save local storage", () => {
      const key = "example2";
      const exampleObject = { key: "value" };
      services.saveToLocalStorage(key, exampleObject);
      expect(localStorage.getItem(key)).toBe(JSON.stringify(exampleObject));
    });
  });

  describe("getFromLocalStorage", () => {
    test("return null if nothing is in the local storage", () => {
      expect(services.getFromLocalStorage("some-key")).toBe(null);
    });

    test("return parsed local storage value", () => {
      const key = "some-key";
      localStorage.setItem(key, JSON.stringify({ example: 1 }));

      const result = services.getFromLocalStorage(key);
      expect(result).toMatchObject({ example: 1 });
    });
  });

  describe("logout", () => {
    test("removes user data from localStorage", () => {
      localStorage.setItem(
        services.USER_DATA_LOCAL_STORAGE_KEY,
        JSON.stringify({ key: "example" })
      );
      expect(
        services.getFromLocalStorage(services.USER_DATA_LOCAL_STORAGE_KEY)
      ).toMatchObject({ key: "example" });

      services.logout();
      expect(
        services.getFromLocalStorage(services.USER_DATA_LOCAL_STORAGE_KEY)
      ).toBe(null);
    });
  });

  describe("Validators", () => {
    test("exists", () => {
      expect(services.Validators.exists()).toBe(false);
      expect(services.Validators.exists(undefined)).toBe(false);
      expect(services.Validators.exists(null)).toBe(false);
      expect(services.Validators.exists("")).toBe(false);
      expect(services.Validators.exists("example")).toBe(true);
    });
  });
});
