// import { AnimatePresence, motion } from "framer-motion";
// import { useAllowance } from "hooks/GLM/useGLMApprove";
// import { formatEther } from "viem";
// import { CheckCircleIcon } from "@heroicons/react/20/solid";

// export const RegisterSummary = ({ isVisible }: { isVisible: boolean }) => {
//   const { data } = useAllowance();
//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           style={{
//             position: "absolute",
//             backgroundColor: "#0000005b",
//             borderRadius: "16px",
//             padding: "1rem",
//             fontSize: "1.3rem",
//             minWidth: "350px",
//           }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//         >
//           <div className="inline">
//             <CheckCircleIcon
//               className="h-8 inline mb-1 mr-2"
//               style={{
//                 color: "#00ff003c",
//               }}
//             />{" "}
//             User registered in service
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
