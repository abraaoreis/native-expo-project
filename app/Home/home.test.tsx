import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import Home from "./home";

// Mock the useHome hook
jest.mock("@/hooks/use-home", () => ({
  useHome: jest.fn(() => ({
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
    loadMore: jest.fn(),
    hasMore: true,
  })),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders home screen correctly", () => {
    render(<Home />);

    expect(screen.getByText("Inicio")).toBeTruthy();
    expect(screen.getByText("Salir")).toBeTruthy();
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
      expect(screen.getByText("Detalles del Instrumento")).toBeTruthy();
      expect(screen.getByText("Nombre: Guitarra Acústica")).toBeTruthy();
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
      expect(screen.getByText("Detalles del Instrumento")).toBeTruthy();
    });

    const closeButton = screen.getByText("Cerrar");
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Detalles del Instrumento")).toBeNull();
    });
  });

  it("calls router.replace when logout is pressed", () => {
    const { useRouter } = require("expo-router");
    const mockReplace = jest.fn();
    useRouter.mockReturnValue({
      replace: mockReplace,
    });

    render(<Home />);

    const logoutButton = screen.getByText("Salir");
    fireEvent.press(logoutButton);

    expect(mockReplace).toHaveBeenCalledWith("/Login");
  });

  it("displays loading footer when hasMore is true", () => {
    render(<Home />);

    expect(screen.getByText("Cargando más...")).toBeTruthy();
  });

  it("displays loaded footer when hasMore is false", () => {
    const { useHome } = require("@/hooks/use-home");
    useHome.mockReturnValue({
      instruments: [],
      loadMore: jest.fn(),
      hasMore: false,
    });

    render(<Home />);

    expect(screen.getByText("Todos los elementos cargados")).toBeTruthy();
  });
});
