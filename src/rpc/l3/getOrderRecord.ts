import getReadOnlyContractsContext from "../getReadOnlyContractsContext";
import { OrderRecordFormatted, formatOrderRecord } from "../../utils/formatter";

async function getOrderRecord(trader: string, orderRecordId: number) {
  const ctx = await getReadOnlyContractsContext();
  const orderRecord = await ctx.orderHistory.orderRecords(
    trader,
    orderRecordId,
  );

  return orderRecord;
}

export default async function getOrderRecordsFormatted(trader: string) {
  const ctx = await getReadOnlyContractsContext();
  const traderOrderRecordCount =
    await ctx.traderVault.getTraderOrderRecordCount(trader);
  const orderRecords = [];
  // get 10 most recent order records
  // FIXME: add pagination

  for (
    let i = traderOrderRecordCount - 1;
    i >= traderOrderRecordCount - 10;
    i -= 1
  ) {
    if (i < 0) break;
    // eslint-disable-next-line no-await-in-loop
    const orderRecord = await getOrderRecord(trader, i);
    orderRecords.push(formatOrderRecord(orderRecord));
  }
  return orderRecords as OrderRecordFormatted[];
}
