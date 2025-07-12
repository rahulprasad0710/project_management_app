// On mount: parse array from URL
// useEffect(() => {
//   const labelFromUrl = searchParams.get("labels");
//   const priorityFromUrl = searchParams.get("priority");
//   const labelListResponse = labelList?.data?.result ?? [];

//   if (labelFromUrl && labelListResponse.length > 0) {
//     const temp = labelFromUrl.split(",");
//     setSelectedLabelsIds(labelFromUrl.split(","));
//     const tempLabel = labelListResponse?.filter((status) =>
//       temp.includes(String(status.id)),
//     );
//     if (tempLabel) {
//       const statusList = tempLabel?.map((status) => {
//         return {
//           label: status.name as string,
//           value: String(status.id) as string,
//         };
//       });
//       setSelectedLabels(statusList);
//     }
//   }
// }, [searchParams, labelList?.data?.result]);
