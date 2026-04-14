const express = require("express");

// Routers
const UserRoutes = require("./Routers/DriverRouters.js");
const BranchRouter = require("./Routers/BranchRouter.js");
const UnitRouter = require("./Routers/UnitRouter.js");
const RouteRouter = require("./Routers/RouteRouters.js");
const CheckListRouter = require("./Routers/CheckListRoute.js");
const ReportRouter = require("./Routers/ReportRouter.js");
const RoleRouter = require("./Routers/RoleRouter.js");
const VehicleTypeRouter = require("./Routers/VehicleTypeRouter.js");
const VehicleDivisionRouter = require("./Routers/VehicleDivisionRouter.js");
const VehicleRouter = require("./Routers/VehicleRouter.js");
const InsuranceRouter = require("./Routers/InsuranceRouter.js");
const PositionRouter = require("./Routers/PositionRouter.js");
const DepartmentRouter = require("./Routers/DepartmentRouter.js");
const UserRouter = require("./Routers/UserRouter.js");
const DashboardRouter = require("./Routers/DashboradRouter.js");
const VerifyOtpRouter = require("./Routers/VerifyOtpRouter.js");
const ChecklistPerBranchReportRouter = require("./Routers/Report/ChecklistPerBranchReportRouter.js");

const router = express.Router();

router.use("/api", UserRoutes);
router.use("/api", BranchRouter);
router.use("/api", UnitRouter);
router.use("/api", RouteRouter);
router.use("/api", CheckListRouter);// Checklist
router.use("/api", ReportRouter); // Report
router.use("/api", RoleRouter);
router.use("/api", VehicleTypeRouter);
router.use("/api", VehicleDivisionRouter);
router.use("/api", VehicleRouter);
router.use("/api", InsuranceRouter);
router.use("/api", PositionRouter);
router.use("/api", DepartmentRouter);
router.use("/api", UserRouter);
router.use("/api", DashboardRouter);
router.use("/api", VerifyOtpRouter);
router.use("/api", ChecklistPerBranchReportRouter);

module.exports = router;
