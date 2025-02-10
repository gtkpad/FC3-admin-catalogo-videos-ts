import { validate as uuidValidate } from "uuid";

import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  it("should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid uuid", () => {
    const uuid = new Uuid();

    expect(uuid).toBeDefined();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a valid uuid", () => {
    const uuid = new Uuid("6b8e4bef-1adb-404e-9172-d492dc087d0b");

    expect(uuid).toBeDefined();
    expect(uuid.id).toBe("6b8e4bef-1adb-404e-9172-d492dc087d0b");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
