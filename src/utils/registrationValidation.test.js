import assert from "node:assert/strict";
import test from "node:test";

import {
  getRegistrationErrorMessage,
  isValidEmail,
} from "./registrationValidation.js";

test("validates email format", () => {
  assert.equal(isValidEmail("anne@example.com"), true);
  assert.equal(isValidEmail("anne@"), false);
  assert.equal(isValidEmail(""), false);
});

test("maps duplicate registration errors to a friendly user message", () => {
  assert.match(
    getRegistrationErrorMessage(
      "duplicate key value violates unique constraint",
    ),
    /allerede tilmeldt/i,
  );
  assert.match(
    getRegistrationErrorMessage("registrations_user_event_unique"),
    /allerede tilmeldt/i,
  );
});
