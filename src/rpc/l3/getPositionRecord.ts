import getReadOnlyContractsContext from "../getReadOnlyContractsContext";
import {
  PositionRecordFormatted,
  formatPositionRecord,
} from "../../utils/formatter";

async function getPositionRecord(trader: string, positionRecordId: number) {
  const ctx = await getReadOnlyContractsContext();

  const positionRecord = await ctx.positionHistory.positionRecords(
    trader,
    positionRecordId,
  );

  return positionRecord;
}

export default async function getPositionRecordsFormatted() {
  const trader = localStorage.getItem("traderAddress");
  if (!trader) {
    return [];
  }
  const ctx = await getReadOnlyContractsContext();
  const traderPositionRecordCount =
    await ctx.traderVault.getTraderPositionRecordCount(trader);

  const positionRecords = [];

  for (
    let i = traderPositionRecordCount - 1;
    i >= traderPositionRecordCount - 10;
    i -= 1
  ) {
    if (i < 0) break;
    // eslint-disable-next-line no-await-in-loop
    const positionRecord = await getPositionRecord(trader, i);
    positionRecords.push(formatPositionRecord(positionRecord));
  }
  return positionRecords as PositionRecordFormatted[];
}
