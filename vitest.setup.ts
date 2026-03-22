import { cleanup } from "@testing-library/react-native";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});
