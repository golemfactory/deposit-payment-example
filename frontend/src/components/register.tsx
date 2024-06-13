// import { AnimatePresence, motion } from "framer-motion";
// import { useUser } from "hooks/useUser";
// import { AllowanceSummary } from "./allowanceSummary";
// import { ApproveForm } from "./homePage/modals/approveForm";
// import { RegisterSummary } from "./registerSummary";
// import { RegisterButton } from "./RegisterButton";
// import { useAccount } from "wagmi";

// const variants = {
//   onTop: {
//     top: "120px",
//     left: "30px",
//   },
//   onCenter: {
//     top: "30vh",
//   },
// };

// export const Register = () => {
//   const { user } = useUser();
//   const { address } = useAccount();
//   return (
//     <motion.div
//       style={{
//         position: "absolute",
//       }}
//       animate={user.isRegistered() ? "onTop" : "onCenter"}
//       variants={variants}
//       transition={{ duration: 0.5 }}
//     >
//       {user.isRegistered() && (
//         <RegisterSummary isVisible={user.isRegistered()} />
//       )}
//     </motion.div>
//   );
// };
