import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./home";

// Mock the useHome hook
vi.mock("@/hooks/useHome", () => ({
  useHome: vi.fn(() => ({
    instruments: [
      {
        id: 1,
        name: "Guitarra Acústica",
        type: "Cordas",
        brand: "Yamaha",
        price: "R$ 1.200,00",
        image: "https://example.com/guitar.jpg",
      },
      {
        id: 2,
        name: "Piano Digital",
        type: "Teclas",
        brand: "Casio",
        price: "R$ 2.500,00",
        image: "https://example.com/piano.jpg",
      },
    ],
    loadMore: vi.fn(),
    hasMore: true,
  })),
}));

// Mock expo-router
vi.mock("expo-router", () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders home screen correctly", () => {
    render(<Home />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Sair")).toBeTruthy();
    expect(screen.getByText("Guitarra Acústica")).toBeTruthy();
    expect(screen.getByText("Piano Digital")).toBeTruthy();
  });

  it("displays instrument list", () => {
    render(<Home />);

    expect(screen.getByText("Cordas • Yamaha")).toBeTruthy();
    expect(screen.getByText("Preço: R$ 1.200,00")).toBeTruthy();
    expect(screen.getByText("Teclas • Casio")).toBeTruthy();
    expect(screen.getByText("Preço: R$ 2.500,00")).toBeTruthy();
  });

  it("opens modal when instrument is pressed", async () => {
    render(<Home />);

    const instrumentItem = screen.getByText("Guitarra Acústica");
    fireEvent.press(instrumentItem);

    await waitFor(() => {
      expect(screen.getByText("Detalhes do Instrumento")).toBeTruthy();
      expect(screen.getByText("Nome: Guitarra Acústica")).toBeTruthy();
      expect(screen.getByText("Tipo: Cordas")).toBeTruthy();
      expect(screen.getByText("Marca: Yamaha")).toBeTruthy();
      expect(screen.getByText("Preço: R$ 1.200,00")).toBeTruthy();
    });
  });

  it("closes modal when close button is pressed", async () => {
    render(<Home />);

    const instrumentItem = screen.getByText("Guitarra Acústica");
    fireEvent.press(instrumentItem);

    await waitFor(() => {
      expect(screen.getByText("Detalhes do Instrumento")).toBeTruthy();
    });

    const closeButton = screen.getByText("Fechar");
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Detalhes do Instrumento")).toBeNull();
    });
  });

  it("calls router.replace when logout is pressed", () => {
    const { useRouter } = require("expo-router");
    const mockReplace = vi.fn();
    useRouter.mockReturnValue({
      replace: mockReplace,
    });

    render(<Home />);

    const logoutButton = screen.getByText("Sair");
    fireEvent.press(logoutButton);

    expect(mockReplace).toHaveBeenCalledWith("/Login");
  });

  it("displays loading footer when hasMore is true", () => {
    render(<Home />);

    expect(screen.getByText("Carregando mais...")).toBeTruthy();
  });

  it("displays loaded footer when hasMore is false", () => {
    const { useHome } = require("@/hooks/useHome");
    useHome.mockReturnValue({
      instruments: [],
      loadMore: vi.fn(),
      hasMore: false,
    });

    render(<Home />);

    expect(screen.getByText("Todos os itens carregados")).toBeTruthy();
  });
});
