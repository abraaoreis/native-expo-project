import instrumentsData from "@/assets/instruments.json";
import { useCallback, useMemo, useState } from "react";

export type Instrument = {
  id: number;
  name: string;
  type: string;
  brand: string;
  price: string;
  image: string;
};

const TOTAL = instrumentsData.length;
const PAGE_SIZE = 10;

export function useHome() {
  const [page, setPage] = useState(1);

  const instruments = useMemo(
    () => instrumentsData.slice(0, page * PAGE_SIZE),
    [page],
  );

  const loadMore = useCallback(() => {
    if (page * PAGE_SIZE >= TOTAL) return;
    setPage((prev) => prev + 1);
  }, [page]);

  return {
    instruments,
    loadMore,
    hasMore: page * PAGE_SIZE < TOTAL,
  };
}
