import { FieldsErrors } from "./validator-fields.interface";

export class EntityValidationError extends Error {
  constructor(
    public readonly error: FieldsErrors,
    message = "Validation error"
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}
