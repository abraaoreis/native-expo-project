import { fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginScreen from "./login";

// Mock the useLogin hook
vi.mock("@/hooks/useLogin", () => ({
  useLogin: vi.fn(() => ({
    control: {},
    errors: {},
    onLogin: vi.fn(),
  })),
}));

// Mock expo-router
vi.mock("expo-router", () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

// Mock Alert
vi.mock("react-native", async () => {
  const actual = await vi.importActual("react-native");
  return {
    ...actual,
    Alert: {
      alert: vi.fn(),
    },
  };
});

describe("LoginScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("E-mail")).toBeTruthy();
    expect(screen.getByText("Senha")).toBeTruthy();
    expect(screen.getByText("Entrar")).toBeTruthy();
    expect(screen.getByText("Esqueci minha senha")).toBeTruthy();
    expect(screen.getByText("Criar usuário")).toBeTruthy();
  });

  it("displays email input", () => {
    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    expect(emailInput).toBeTruthy();
  });

  it("displays password input", () => {
    render(<LoginScreen />);

    const passwordInput = screen.getByPlaceholderText("********");
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("calls onLogin when login button is pressed", () => {
    const mockOnLogin = vi.fn();
    const { useLogin } = require("@/hooks/useLogin");
    useLogin.mockReturnValue({
      control: {},
      errors: {},
      onLogin: mockOnLogin,
    });

    render(<LoginScreen />);

    const loginButton = screen.getByText("Entrar");
    fireEvent.press(loginButton);

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it("shows alert when forgot password is pressed", () => {
    const { Alert } = require("react-native");

    render(<LoginScreen />);

    const forgotPasswordButton = screen.getByText("Esqueci minha senha");
    fireEvent.press(forgotPasswordButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Esqueci minha senha",
      "Redefinição de senha solicitada.",
    );
  });

  it("shows alert when create user is pressed", () => {
    const { Alert } = require("react-native");

    render(<LoginScreen />);

    const createUserButton = screen.getByText("Criar usuário");
    fireEvent.press(createUserButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Criar usuário",
      "Navegue para cadastro de usuário aqui.",
    );
  });
});
