import { atom } from "recoil";
import {
  OpenPositionFormatted,
  OrderRecordFormatted,
  PositionRecordFormatted,
} from "@/utils/formatter";

export const traderAddressState = atom<string>({
  key: "traderAddress",
  default: "",
});

export const traderAddressShortState = atom<string>({
  key: "traderAddressShort",
  default: "not connected",
});

export const openPositionState = atom<OpenPositionFormatted[]>({
  key: "openPosition",
  default: [],
});

export const orderHistoryState = atom<OrderRecordFormatted[]>({
  key: "orderHistory",
  default: [],
});

export const positionHistoryState = atom<PositionRecordFormatted[]>({
  key: "positionHistory",
  default: [],
});

export const traderBalanceState = atom<number>({
  key: "traderBalance",
  default: 0,
});

export const totalActiveMargin = atom<number>({
  key: "totalActiveMargin",
  default: 0,
});

export const totalPnL = atom<number>({
  key: "totalPnL",
  default: 0,
});

// export const globalLongOIState = atom<number>({
//   key: "globalLongOI",
//   default: 0,
// });

// export const globalShortOIState = atom<number>({
//   key: "globalShortOI",
//   default: 0,
// });

// export const priceBufferState = atom<number>({
//   key: "priceBuffer",
//   default: 0,
// });
