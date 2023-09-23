import { ethers } from "ethers";

export function formatStruct(struct: any) {
  if (struct === undefined) {
    return undefined;
  }
  const result: any = {};
  const keys = Object.keys(struct);
  const N = keys.length / 2;
  for (let i = 0; i < N; i += 1) {
    const key = keys[i + N];
    const value = struct[key];
    result[key] = value;
  }

  return result;
}

const ETH_DECIMAL = 18;
const USDC_DECIMAL = 20; // FIXME:
const PRICE_BUFFER_DECIMAL = 10;
const FUNDING_RATE_DECIMAL = 26;
const FUNDING_INDEX_DECIMAL = 12;

enum OrderType {
  Market,
  Limit,
  StopMarket,
  StopLimit,
}

export type OpenPositionFormatted = {
  trader: string;
  isLong: boolean;
  unrealizedPnl: string;
  currentPositionRecordId: number;
  marketId: number;
  size: string;
  margin: string;
  avgOpenPrice: string;
  lastUpdatedTime: number;
  avgEntryFundingIndex: string; // int256
  sizeBN: ethers.BigNumber;
  marginBN: ethers.BigNumber;
  pnl: number;
};

export type OrderRecordFormatted = {
  orderType: OrderType;
  isLong: boolean;
  isIncrease: boolean;
  positionRecordId: number;
  marketId: number;
  sizeAbs: string;
  marginAbs: string;
  executionPrice: string;
  timestamp: string;
};

export type PositionRecordFormatted = {
  isClosed: boolean;
  cumulativeRealizedPnl: string;
  cumulativeClosedSize: string;
  marketId: number;
  maxSize: number;
  avgOpenPrice: string;
  avgClosePrice: string;
  openTimestamp: string;
  closeTimestamp: string;
};

export type GlobalPositionStateFormatted = {
  totalSize: string;
  totalMargin: string;
  avgPrice: string;
};

export function formatPosition(struct: any, markPrice: number) {
  struct = formatStruct(struct);
  struct.sizeBN = struct.size;
  struct.marginBN = struct.margin;
  struct.unrealizedPnl = ethers.utils.formatUnits(
    struct.unrealizedPnl,
    USDC_DECIMAL,
  ); // FIXME: check if USD or tokenCount
  struct.currentPositionRecordId = struct.currentPositionRecordId.toNumber();
  struct.marketId = struct.marketId.toNumber();
  struct.size = ethers.utils.formatUnits(struct.size, ETH_DECIMAL);
  struct.margin = ethers.utils.formatUnits(struct.margin, USDC_DECIMAL);
  struct.avgOpenPrice = ethers.utils.formatUnits(
    struct.avgOpenPrice,
    USDC_DECIMAL,
  );
  struct.lastUpdatedTime = struct.lastUpdatedTime.toNumber();
  struct.avgEntryFundingIndex = ethers.utils.formatUnits(
    struct.avgEntryFundingIndex,
    FUNDING_INDEX_DECIMAL,
  );
  struct.pnl = struct.isLong
    ? (+markPrice - +struct.avgOpenPrice) * +struct.size
    : -1 * (+markPrice - +struct.avgOpenPrice) * +struct.size;

  return struct as OpenPositionFormatted;
}

export function formatOrderRecord(struct: any) {
  struct = formatStruct(struct);

  struct.orderType = OrderType[struct.orderType];
  struct.positionRecordId = struct.positionRecordId.toNumber();
  struct.marketId = struct.marketId.toNumber();
  struct.sizeAbs = ethers.utils.formatUnits(struct.sizeAbs, ETH_DECIMAL);
  struct.marginAbs = ethers.utils.formatUnits(struct.marginAbs, USDC_DECIMAL);
  struct.executionPrice = ethers.utils.formatUnits(
    struct.executionPrice,
    USDC_DECIMAL,
  );
  const MULTIPLIER = 1000;
  const date = new Date(struct.timestamp.toNumber() * MULTIPLIER);

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  struct.timestamp = `${date.getFullYear()}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return struct as OrderRecordFormatted;
}

export function formatPositionRecord(struct: any) {
  struct = formatStruct(struct);

  struct.cumulativeRealizedPnl = ethers.utils.formatUnits(
    struct.cumulativeRealizedPnl,
    USDC_DECIMAL,
  );
  struct.cumulativeClosedSize = ethers.utils.formatUnits(
    struct.cumulativeClosedSize,
    ETH_DECIMAL,
  );
  struct.marketId = struct.marketId.toNumber();
  struct.maxSize = ethers.utils.formatUnits(struct.maxSize, ETH_DECIMAL);
  struct.avgOpenPrice = ethers.utils.formatUnits(
    struct.avgOpenPrice,
    USDC_DECIMAL,
  );
  struct.avgClosePrice = ethers.utils.formatUnits(
    struct.avgClosePrice,
    USDC_DECIMAL,
  );
  const MULTIPLIER = 1000;
  const openDate = new Date(struct.openTimestamp.toNumber() * MULTIPLIER);
  const closeDate = new Date(struct.closeTimestamp.toNumber() * MULTIPLIER);
  const openMonth = (openDate.getMonth() + 1).toString().padStart(2, "0");
  const closeMonth = (closeDate.getMonth() + 1).toString().padStart(2, "0");
  const openDay = openDate.getDate().toString().padStart(2, "0");
  const closeDay = closeDate.getDate().toString().padStart(2, "0");

  struct.openTimestamp = `${openDate.getFullYear()}-${openMonth}-${openDay} ${openDate.getHours()}:${openDate.getMinutes()}:${openDate.getSeconds()}`;
  struct.closeTimestamp = `${closeDate.getFullYear()}-${closeMonth}-${closeDay} ${closeDate.getHours()}:${closeDate.getMinutes()}:${closeDate.getSeconds()}`;

  return struct as PositionRecordFormatted;
}

export function formatGlobalPositionState(struct: any) {
  struct = formatStruct(struct);

  struct.totalSize = ethers.utils.formatUnits(struct.totalSize, ETH_DECIMAL);
  struct.totalMargin = ethers.utils.formatUnits(
    struct.totalMargin,
    ETH_DECIMAL,
  );
  struct.avgPrice = ethers.utils.formatUnits(struct.avgPrice, USDC_DECIMAL);

  return struct as GlobalPositionStateFormatted;
}

export function formatUSDC(value: any) {
  return ethers.utils.formatUnits(value, USDC_DECIMAL);
}

export function parseUSDC(value: any) {
  return ethers.utils.parseUnits(value, USDC_DECIMAL);
}

export function formatETH(value: any) {
  return ethers.utils.formatUnits(value, ETH_DECIMAL);
}

export function formatPriceBuffer(value: any) {
  return ethers.utils.formatUnits(value, PRICE_BUFFER_DECIMAL);
}

export function formatUsdString(value: number, decimals: number) {
  return value
    .toFixed(decimals)
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
