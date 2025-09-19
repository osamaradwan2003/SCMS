// import React from "react";
// import { Card, Descriptions, Button, Spin, Tag, Avatar } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import { useTranslate } from "@/hooks/locales";
// import dayjs from "dayjs";
// import { employeesApi, type Employee } from "@/api/employees";

// // A detail type that supports both FE and BE employee shapes
// type EmployeeDetail = Employee & {
//   name?: string;
//   role?: string;
//   joinDate?: string;
//   docs?: string;
//   profile_image?: string;
//   department?: string;
//   employeeId?: string;
//   position?: string;
//   status?: Employee["status"]; // optional for BE shape compatibility
// };

// const ViewEmployeePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const t = useTranslate("employees");

//   const { data: employee, isLoading } = useQuery<EmployeeDetail | undefined>({
//     queryKey: ["employee", id],
//     queryFn: async () => {
//       if (!id) return undefined;
//       const res = await employeesApi.getById(id);
//       return res.data as unknown as EmployeeDetail;
//     },
//     enabled: !!id,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!employee) {
//     return (
//       <div className="p-6">
//         <Card>
//           <div className="text-center">
//             <p>{t("no_data")}</p>
//             <Button onClick={() => navigate("/employees")}>{t("back")}</Button>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/employees")}>
//             {t("back")}
//           </Button>
//           <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/employees/${id}/edit`)}>
//             {t("edit")}
//           </Button>
//         </div>

//         <Card title={t("view_employee") || "Employee Details"}>
//           <div className="flex items-center gap-3 mb-4">
//             <Avatar src={employee.profile_image ? `${import.meta.env.VITE_API_STATIC_URL}${employee.profile_image}` : undefined} size={64}>
//               {employee.firstName?.[0] || employee.lastName?.[0] || employee.name?.[0] || "U"}
//             </Avatar>
//             <div>
//               <div className="text-lg font-semibold">
//                 {employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.name || ""}
//               </div>
//               {employee.status ? <Tag>{employee.status}</Tag> : null}
//             </div>
//           </div>

//           <Descriptions bordered column={2}>
//             <Descriptions.Item label={t("fields.employeeId")}>
//               {employee.employeeId || "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.department")}>
//               {employee.department || "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.position")}>
//               {employee.position ?? employee.role ?? "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.hireDate")}>
//               {employee.hireDate
//                 ? dayjs(employee.hireDate).format("YYYY-MM-DD")
//                 : employee.joinDate
//                 ? dayjs(employee.joinDate).format("YYYY-MM-DD")
//                 : "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.salary")}>
//               {employee.salary?.toLocaleString?.() || "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.manager")}>
//               {employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label={t("fields.docs")} span={2}>
//               {employee.docs
//                 ? employee.docs
//                     .split(",")
//                     .filter(Boolean)
//                     .map((p: string, idx: number) => (
//                       <div key={idx}>
//                         <a href={`${import.meta.env.VITE_API_STATIC_URL}${p}`} target="_blank" rel="noreferrer">
//                           {p.split("/").pop()}
//                         </a>
//                       </div>
//                     ))
//                 : "-"}
//             </Descriptions.Item>
//           </Descriptions>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ViewEmployeePage;
