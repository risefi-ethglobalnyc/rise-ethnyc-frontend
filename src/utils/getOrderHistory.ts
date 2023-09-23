import getOrderRecordsFormatted from "@/rpc/l3/getOrderRecord";
import { useQuery } from "@tanstack/react-query";

export const getOrderHistoryFormatted = async () => {
  const traderAddress = localStorage.getItem("traderAddress");
  if (!traderAddress) {
    return [];
  }
  console.log(">>> getOrderHistoryFormatted");
  return await getOrderRecordsFormatted(traderAddress);
};
