// // src/components/ImageCell.jsx
// import React from 'react';
// import { FaEye, FaCloudUploadAlt, FaEyeSlash } from 'react-icons/fa';
// // import { RxValueNone } from 'react-icons/rx';


// const ImageCell = ({ row, role, ntid, handleFileUpload, handleImageClick }) => {
  
//   return (
//     <td className="">
//       {row.imageurl ? (
//         <button
//           className="btn bg-transparent text-success fs-4 btn-sm w-100 text-center"
//           onClick={() => handleImageClick(row.signedImageUrl || row.imageurl)}
//           aria-label="View image"
//         >
//           <FaEye />
//         </button>
//       ) : (
//         <div className="badge">
//           {role === 'user' && ntid[row.serial] && (
//             <>
//               <input
//                 type="file"
//                 id={`file-input-${row.serial}`}
//                 accept="image/*"
//                 className="form-control form-control-sm d-none "
//                 onChange={(e) => handleFileUpload(e, row)}
//                 aria-label="Upload image"
//               />
//               <label
//                 htmlFor={`file-input-${row.serial}`}
//                 className="btn bg-transparent text-danger fs-6 btn-sm w-100 text-center"
//                 aria-label="Upload image"
//               >
//                 <FaCloudUploadAlt  className='fs-2'/>
//               </label>
//             </>
//           )}
         
//           {(role === 'manager' || role === 'admin') && (
//             <label
//               className="btn bg-transparent text-danger fs-6 btn-sm w-100 text-center"
//               aria-label="No image available"
//             >
//               <FaEyeSlash />
//             </label>
//           )}
//         </div>
//       )}
//     </td>
//   );
// };

// export default ImageCell;