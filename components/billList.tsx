// import { api } from "~/utils/api";
// import { LoadingSpinner } from "./loading";
// import { BillFormating } from "./billListFormat";
// import { useUser } from "@clerk/nextjs";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

// export function BillList() {
//   const { isSignedIn } = useUser();

//   if (!isSignedIn)
//     return (

//     );

//   if (isSignedIn) {

//     if (postsLoading) return <LoadingSpinner />;

//     if (!data || data.length === 0)
//       return (
//         <div>
//           <h1 className="center">No bills created yet! 👩‍🏫</h1>
//         </div>
//       );

//     return (

//     );
//   }
//   return (
//     <div>
//       <h3 className="center">Something Went Wrong!</h3>
//     </div>
//   );
// }
