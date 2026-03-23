import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import LoginScreen from "../../app/Login/login";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders login screen correctly", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Iniciar Sesión")).toBeTruthy();
    expect(screen.getByText("Correo Electrónico")).toBeTruthy();
    expect(screen.getByText("Contraseña")).toBeTruthy();
    expect(screen.getByPlaceholderText("tu@correo.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("********")).toBeTruthy();
    expect(screen.getByText("Entrar")).toBeTruthy();
  });

  it(
    "shows validation errors when clicking 'Entrar' with empty fields",
    async () => {
      render(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText("tu@correo.com");
      const passwordInput = screen.getByPlaceholderText("********");
      const loginButton = screen.getByText("Entrar");

      // Trigger change to ensure fields are recognized as changed/dirty if needed
      fireEvent.changeText(emailInput, "temp");
      fireEvent.changeText(emailInput, "");
      fireEvent.changeText(passwordInput, "temp");
      fireEvent.changeText(passwordInput, "");
      
      fireEvent.press(loginButton);

      // Relaxed wait and find
      expect(await screen.findByText(/Ingresa tu correo/i)).toBeTruthy();
      expect(await screen.findByText(/Ingresa tu contraseña/i)).toBeTruthy();
    },
    15000,
  );

  it("shows invalid email error", async () => {
    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText("tu@correo.com");
    fireEvent.changeText(emailInput, "invalid-email");

    const loginButton = screen.getByText("Entrar");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Correo electrónico inválido.")).toBeTruthy();
    });
  });

  it("shows password too short error", async () => {
    render(<LoginScreen />);

    const passwordInput = screen.getByPlaceholderText("********");
    fireEvent.changeText(passwordInput, "short");

    const loginButton = screen.getByText("Entrar");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText("La contraseña debe tener al menos 8 caracteres."),
      ).toBeTruthy();
    });
  });

  it("calls Alert.alert and router.replace on successful login", async () => {
    const { useRouter } = require("expo-router");
    const mockReplace = jest.fn();
    useRouter.mockReturnValue({ replace: mockReplace });

    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText("tu@correo.com");
    const passwordInput = screen.getByPlaceholderText("********");
    const loginButton = screen.getByText("Entrar");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Éxito",
        "Inicio de sesión validado con éxito!",
      );
      expect(mockReplace).toHaveBeenCalledWith("/Home");
    });
  });

  it("shows alerts for footer links", () => {
    render(<LoginScreen />);

    const forgotPasswordLink = screen.getByText("Olvidé mi contraseña");
    fireEvent.press(forgotPasswordLink);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Olvidé mi contraseña",
      "Redefinición de contraseña solicitada.",
    );

    const createUserLink = screen.getByText("Crear usuario");
    fireEvent.press(createUserLink);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Crear usuario",
      "Navega al registro de usuario aquí.",
    );
  });
});
