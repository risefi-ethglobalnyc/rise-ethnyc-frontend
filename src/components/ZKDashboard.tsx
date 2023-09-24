// {
//   /* Activity list */
// }
// <div className="border-t border-white/10 pt-11">
//   <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
//     Price Data Integrity Proof
//   </h2>
//   <table className="mt-6 w-full whitespace-nowrap text-left">
//     <colgroup>
//       <col className="w-full sm:w-2/12" />
//       <col className="lg:w-2/12" />
//       <col className="lg:w-3/12" />
//       <col className="lg:w-3/12" />
//       <col className="lg:w-2/12" />
//     </colgroup>
//     <thead className="border-b border-white/10 text-sm leading-6 text-white">
//       <tr>
//         <th
//           scope="col"
//           className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
//         >
//           Tx Id
//         </th>
//         <th
//           scope="col"
//           className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
//         >
//           Mark Price
//         </th>
//         <th
//           scope="col"
//           className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
//         >
//           Proving Key
//         </th>
//         <th
//           scope="col"
//           className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
//         >
//           Data Integrity Status
//         </th>

//         <th
//           scope="col"
//           className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
//         >
//           Timestamp
//         </th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-white/5">
//       {activityItems.map((item) => (
//         <tr
//           key={item.commit}
//           className="hover:bg-gray-700"
//           onClick={() => setSlideOverOpen(true)}
//         >
//           <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
//             <div className="flex items-center gap-x-4">
//               <div className="truncate text-sm font-normal leading-6 text-gray-400">
//                 {item.tx_id}
//               </div>
//             </div>
//           </td>
//           <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
//             {item.mark_price}
//           </td>
//           <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
//             <div className="flex gap-x-3">
//               <div className="font-mono text-sm leading-6 text-gray-400">
//                 {item.commit}
//               </div>
//               <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
//                 {item.branch}
//               </span>
//             </div>
//           </td>
//           <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
//             <div className="flex items-center justify-end gap-x-2 sm:justify-start">
//               <time
//                 className="text-gray-400 sm:hidden"
//                 dateTime={item.dateTime}
//               >
//                 {item.date}
//               </time>
//               <div
//                 className={classNames(
//                   statuses[item.status],
//                   "flex-none rounded-full p-1",
//                 )}
//               >
//                 <div className="h-1.5 w-1.5 rounded-full bg-current" />
//               </div>
//               <div className="hidden text-white sm:block">
//                 {item.status} (3/3)
//               </div>
//             </div>
//           </td>
//           <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
//             <time dateTime={item.dateTime}>{item.dateTime}</time>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>;
