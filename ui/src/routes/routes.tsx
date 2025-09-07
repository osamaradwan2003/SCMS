import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { lazy } from "react";

const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));

// Student pages
const CreateStudent = lazy(() => import("@pages/student/Create"));

// Auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Logout = lazy(() => import("@/pages/auth/Logout"));

// Guardians pages
const GuardiansListPage = lazy(() => import("@/pages/guardians/List"));
const CreateGuardianPage = lazy(() => import("@/pages/guardians/Create"));
const EditGuardianPage = lazy(() => import("@/pages/guardians/Edit"));
const ViewGuardianPage = lazy(() => import("@/pages/guardians/View"));

// Classes pages
const ClassesListPage = lazy(() => import("@/pages/classes/List"));
const CreateClassPage = lazy(() => import("@/pages/classes/Create"));
const EditClassPage = lazy(() => import("@/pages/classes/Edit"));
const ViewClassPage = lazy(() => import("@/pages/classes/View"));

// Subjects pages
const SubjectsListPage = lazy(() => import("@/pages/subjects/List"));
const CreateSubjectPage = lazy(() => import("@/pages/subjects/Create"));
const EditSubjectPage = lazy(() => import("@/pages/subjects/Edit"));
const ViewSubjectPage = lazy(() => import("@/pages/subjects/View"));

// Weekly Reports pages
const WeeklyReportsPage = lazy(() => import("@/pages/weeklyreports"));

// Employees pages
const EmployeesPage = lazy(() => import("@/pages/employees"));

// Attendance pages
const AttendancePage = lazy(() => import("@/pages/attendance"));

// Payroll pages
const PayrollPage = lazy(() => import("@/pages/payroll"));

// Transactions pages
const TransactionsPage = lazy(() => import("@/pages/transactions"));

// Categories pages
const CategoriesPage = lazy(() => import("@/pages/categories"));

// Banks pages
const BanksPage = lazy(() => import("@/pages/banks"));

// Messages pages
const MessagesPage = lazy(() => import("@/pages/messages"));

// Income Types pages
const IncomeTypesPage = lazy(() => import("@/pages/incometypes"));

// Expense Types pages
const ExpenseTypesPage = lazy(() => import("@/pages/expensetypes"));

// Subscriptions pages
const SubscriptionsPage = lazy(() => import("@/pages/subscriptions"));

const AppRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "", element: <Navigate to="login" />, index: true },
    ],
  },
  {
    path: "/auth/logout",
    element: <Logout />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Dashboard />, index: true },
      {
        path: "students",
        children: [
          { path: "", element: <>list</>, index: true },
          { path: "create", element: <CreateStudent /> },
          { path: ":id/edit", element: <>update</> },
          { path: ":id", element: <>view</> },
        ],
      },
      {
        path: "guardians",
        children: [
          { path: "", element: <GuardiansListPage />, index: true },
          { path: "create", element: <CreateGuardianPage /> },
          { path: ":id/edit", element: <EditGuardianPage /> },
          { path: ":id", element: <ViewGuardianPage /> },
        ],
      },
      {
        path: "classes",
        children: [
          { path: "", element: <ClassesListPage />, index: true },
          { path: "create", element: <CreateClassPage /> },
          { path: ":id/edit", element: <EditClassPage /> },
          { path: ":id", element: <ViewClassPage /> },
        ],
      },
      {
        path: "subjects",
        children: [
          { path: "", element: <SubjectsListPage />, index: true },
          { path: "create", element: <CreateSubjectPage /> },
          { path: ":id/edit", element: <EditSubjectPage /> },
          { path: ":id", element: <ViewSubjectPage /> },
        ],
      },
      {
        path: "weekly-reports",
        children: [
          { path: "", element: <WeeklyReportsPage />, index: true },
          { path: "create", element: <div>Create Weekly Report</div> },
          { path: ":id/edit", element: <div>Edit Weekly Report</div> },
          { path: ":id", element: <div>View Weekly Report</div> },
        ],
      },
      {
        path: "employees",
        children: [
          { path: "", element: <EmployeesPage />, index: true },
          { path: "create", element: <div>Create Employee</div> },
          { path: ":id/edit", element: <div>Edit Employee</div> },
          { path: ":id", element: <div>View Employee</div> },
        ],
      },
      {
        path: "attendance",
        children: [
          { path: "", element: <AttendancePage />, index: true },
          { path: "create", element: <div>Mark Attendance</div> },
          { path: ":id", element: <div>View Attendance</div> },
        ],
      },
      {
        path: "payroll",
        children: [
          { path: "", element: <PayrollPage />, index: true },
          { path: "create", element: <div>Create Payroll</div> },
          { path: ":id/edit", element: <div>Edit Payroll</div> },
          { path: ":id", element: <div>View Payroll</div> },
        ],
      },
      {
        path: "transactions",
        children: [
          { path: "", element: <TransactionsPage />, index: true },
          { path: "create", element: <div>Create Transaction</div> },
          { path: ":id/edit", element: <div>Edit Transaction</div> },
          { path: ":id", element: <div>View Transaction</div> },
        ],
      },
      {
        path: "categories",
        children: [
          { path: "", element: <CategoriesPage />, index: true },
          { path: "create", element: <div>Create Category</div> },
          { path: ":id/edit", element: <div>Edit Category</div> },
          { path: ":id", element: <div>View Category</div> },
        ],
      },
      {
        path: "banks",
        children: [
          { path: "", element: <BanksPage />, index: true },
          { path: "create", element: <div>Create Bank</div> },
          { path: ":id/edit", element: <div>Edit Bank</div> },
          { path: ":id", element: <div>View Bank</div> },
        ],
      },
      {
        path: "messages",
        children: [
          { path: "", element: <MessagesPage />, index: true },
          { path: "create", element: <div>Send Message</div> },
          { path: ":id", element: <div>Message Details</div> },
        ],
      },
      {
        path: "income-types",
        children: [
          { path: "", element: <IncomeTypesPage />, index: true },
          { path: "create", element: <div>Create Income Type</div> },
          { path: ":id/edit", element: <div>Edit Income Type</div> },
          { path: ":id", element: <div>View Income Type</div> },
        ],
      },
      {
        path: "expense-types",
        children: [
          { path: "", element: <ExpenseTypesPage />, index: true },
          { path: "create", element: <div>Create Expense Type</div> },
          { path: ":id/edit", element: <div>Edit Expense Type</div> },
          { path: ":id", element: <div>View Expense Type</div> },
        ],
      },
      {
        path: "subscriptions",
        children: [
          { path: "", element: <SubscriptionsPage />, index: true },
          { path: "create", element: <div>Create Subscription</div> },
          { path: ":id/edit", element: <div>Edit Subscription</div> },
          { path: ":id", element: <div>View Subscription</div> },
        ],
      },
      {
        path: "user/me",
        element: <div>User Profile</div>,
      },
      {
        path: "settings",
        element: <div>Settings</div>,
      },
    ],
  },
];

export default AppRoutes;
