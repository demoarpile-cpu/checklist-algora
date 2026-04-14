const CheckListModel = require("../Models/CheckListModel.js");
const filledCheckListModel = require("../Models/FillCheckListModel.js");
const { getroutebybranchId } = require("../Utills/Helpers.js");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const routeModel = require("../Models/RouteModels.js");
const vehicleModel = require("../Models/VehicleModel.js");
const BranchModel = require("../Models/BranchModel.js");
const driverModel = require("../Models/DriverModel.js");



const getChecklistPerBranchReport = asyncHandler(async (req, res) => {
  try {
    const branches = await BranchModel.find({}).lean();
    const report = [];

    for (const branch of branches) {
      const branchId = branch._id;

      const requiredCount = await CheckListModel.countDocuments({
        branches: new mongoose.Types.ObjectId(branchId)
      });

      const filledChecklistIds = await filledCheckListModel.distinct("checklistId", {
        BranchId: new mongoose.Types.ObjectId(branchId)
      });

      const filledCount = filledChecklistIds.length;
      const pendingCount = requiredCount - filledCount;

      const pendingPercentage = requiredCount
        ? ((pendingCount / requiredCount) * 100).toFixed(2)
        : "0.00";
      const compliancePercentage = requiredCount
        ? ((filledCount / requiredCount) * 100).toFixed(2)
        : "0.00";

      const latestFilled = await filledCheckListModel
        .findOne({ BranchId: new mongoose.Types.ObjectId(branchId) })
        .sort({ createdAt: -1 })
        .select("createdAt")
        .lean();

      report.push({
        BranchId: branch._id,
        BranchName: branch.branchName,
        RequiredReports: requiredCount,
        FilledReports: filledCount,
        PendingReports: pendingCount,
        PendingPercentage: `${pendingPercentage}%`,
        TotalCompliance: `${compliancePercentage}%`,
        createdAt: latestFilled ? latestFilled.createdAt : null
      });
    }

    res.status(200).json({
      success: true,
      totalBranches: report.length,
      data: report
    });
  } catch (err) {
    console.error("Error generating branch report:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const checklistPerRouteData = asyncHandler(async (req, res) => {
  try {
    const checklists = await CheckListModel.find({})
      .select("branches _id answers")
      .lean();

    const reportMap = new Map();

    for (const checklist of checklists) {
      for (const branchId of checklist.branches) {
        const routes = await routeModel.find({ branchCode: branchId }).lean();

        for (const route of routes) {
          const reportKey = route._id.toString();
          if (reportMap.has(reportKey)) continue;

          const lastFilled = await filledCheckListModel
            .findOne({ BranchId: branchId, routeId: route._id })
            .sort({ createdAt: -1 })
            .lean();

          let redCount = 0, orangeCount = 0, greenCount = 0, othersCount = 0;

          if (lastFilled) {
            const masterChecklist = await CheckListModel.findById(lastFilled.checklistId)
              .select("answers")
              .lean();

            if (lastFilled.answers && masterChecklist) {
              for (const ans of lastFilled.answers) {
                const masterQ = masterChecklist.answers.find(
                  (q) => String(q._id) === String(ans.questionId)
                );

                if (masterQ) {
                  if (ans.answerId) {
                    const selectedOpt = masterQ.options.find(
                      (o) => String(o._id) === String(ans.answerId)
                    );

                    if (selectedOpt) {
                      if (selectedOpt.action === "wrong") redCount++;
                      if (selectedOpt.action === "warning") orangeCount++;
                      if (selectedOpt.action === "correct") greenCount++;
                    }
                  } else {
                    othersCount++;
                  }
                }
              }
            }
          }

          const vehicle = await vehicleModel.findOne({ branchCode: branchId }).lean();

          const drivers = vehicle
            ? await driverModel.find({ assignVehicles: vehicle._id }).lean()
            : [];

          reportMap.set(reportKey, {
            RouteId: route._id,
            RouteName: route.routeNumber,
            BranchId: branchId,
            EconomicNumber: vehicle ? vehicle.economicNumber : null,
            DriverCount: drivers.length,
            RedFlag: redCount,
            OrangeFlag: orangeCount,
            GreenFlag: greenCount,
            Others: othersCount,
            LastFilledAt: lastFilled ? lastFilled.createdAt : null,
          });
        }
      }
    }

    const report = Array.from(reportMap.values());

    res.status(200).json({
      success: true,
      totalRecords: report.length,
      data: report,
    });
  } catch (err) {
    console.error("Error generating route report:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const checklistecnomicunit = asyncHandler(async (req, res) => {
  try {
    const routes = await routeModel.find({}).lean();
    const report = [];

    for (const route of routes) {
      const checklists = await CheckListModel.find({ routes: route._id })
        .select("_id")
        .lean();

      const checklistIds = checklists.map(c => c._id);

      const lastFilled = await filledCheckListModel
        .findOne({ checklistId: { $in: checklistIds } })
        .sort({ createdAt: -1 })
        .lean();

      let redCount = 0, orangeCount = 0;

      if (lastFilled && lastFilled.answers) {
        for (const ans of lastFilled.answers) {
          if (ans.options && Array.isArray(ans.options)) {
            ans.options.forEach(opt => {
              if (opt.action === "red") redCount++;
              if (opt.action === "orange") orangeCount++;
            });
          }
        }
      }

      const vehicle = await vehicleModel.findOne({
        branchCode: route.branchCode
      }).select("economicNumber");

      report.push({
        RouteId: route._id,
        RouteName: route.routeNumber || "",
        EconomicNumber: vehicle ? vehicle.economicNumber : null,
        RedFlag: redCount,
        OrangeFlag: orangeCount
      });
    }

    res.status(200).json({
      success: true,
      totalRoutes: report.length,
      data: report
    });
  } catch (err) {
    console.error("Error generating route report:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});




//---------------------------------------------------------------------------------------------------------------------------------


const FilledChecklistByBranchId = asyncHandler(async (req, res) => {
  try {
    const { branchId } = req.body;

    if (!branchId) {
      return res.status(400).json({ message: "branchId is required" });
    }

    const filledChecklists = await filledCheckListModel.find({ BranchId: branchId });

    if (!filledChecklists || filledChecklists.length === 0) {
      return res.status(200).json([]);
    }

    const checklistIds = [...new Set(filledChecklists.map(fc => fc.checklistId.toString()))];
    const checklistDocs = await CheckListModel.find({ _id: { $in: checklistIds } });

    const driverIds = [...new Set(filledChecklists.map(fc => fc.driverId.toString()))];
    const assignVehicleData = await driverModel.find({ _id: { $in: driverIds } }).select("assignVehicles");

    const vehicleIds = assignVehicleData.map(d => d.assignVehicles?.toString()).filter(Boolean);
    const findVehicles = await vehicleModel.find({ _id: { $in: vehicleIds } }).populate("route", "routeNumber");

    const vehicleMap = {};
    findVehicles.forEach(v => {
      vehicleMap[v._id.toString()] = {
        economicNumber: v.economicNumber,
        routeNumber: v.route?.routeNumber || "N/A"
      };
    });

    const checklistMap = {};
    const questionTextMap = {};
    const choiceTextMap = {};

    checklistDocs.forEach(cl => {
      const optionsMap = {};
      cl.answers.forEach(q => {
        questionTextMap[q._id.toString()] = q.question;
        q.options.forEach(opt => {
          optionsMap[opt._id.toString()] = opt.action;
          choiceTextMap[opt._id.toString()] = opt.choices;
        });
      });
      checklistMap[cl._id.toString()] = optionsMap;
    });

    const finalData = await Promise.all(
      filledChecklists.map(async (item, index) => {
        const optionsMap = checklistMap[item.checklistId.toString()] || {};
        const red = [], orange = [], green = [];

        item.answers.forEach(ans => {
          const action = optionsMap[ans.answerId];
          const question = questionTextMap[ans.questionId] || "N/A";
          const answer = choiceTextMap[ans.answerId] || ans.answer || "N/A";
          const comment = ans.comment || ans.answerComment || null;

          const answerObj = { flag: action, question, answer, comment };

          if (action === "wrong") red.push(answerObj);
          else if (action === "warning") orange.push(answerObj);
          else if (action === "correct") green.push(answerObj);
        });

        const findVehicle = await driverModel
          .findById(item.driverId)
          .populate("route", "routeNumber")
          .populate("branchCode", "branchName");

        const routeData = findVehicle?.route?._id;
        const branchData = findVehicle?.branchCode?._id;

        const seekVehicle = await vehicleModel.findOne({
          route: routeData,
          branchCode: branchData
        });

        return {
          sr: index + 1,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "N/A",
          driverId: item.driverId,
          economicNo: seekVehicle?.economicNumber || "N/A",
          route: findVehicle?.route?.routeNumber || "N/A",
          red,
          orange,
          green
        };
      })
    );

    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const FilledChecklistByRouteId = asyncHandler(async (req, res) => {
  try {
    const { routeId } = req.body;
    if (!routeId) {
      return res.status(400).json({ message: "routeId is required" });
    }

    const routeDoc = await routeModel.findById(routeId).select("branchCode");
    if (!routeDoc) {
      return res.status(404).json({ message: "Route not found" });
    }

    const branchId = routeDoc.branchCode?.toString();
    if (!branchId) {
      return res.status(404).json({ message: "No branch found for this route" });
    }

    const checklistDocs = await CheckListModel.find({ branches: branchId })
      .populate({ path: "branches", select: "_id" });

    const checklistIds = checklistDocs.map(cl => cl._id.toString());
    if (checklistIds.length === 0) {
      return res.status(200).json([]);
    }

    const filledChecklists = await filledCheckListModel.find({
      checklistId: { $in: checklistIds }
    });

    const driverIds = [...new Set(filledChecklists.map(fc => fc.driverId.toString()))];
    const assignVehicleData = await driverModel.find({ _id: { $in: driverIds } });

    let vehicleIds = assignVehicleData.map(d => d.assignVehicles?.toString()).filter(Boolean);

    let findVehicles = [];
    if (vehicleIds.length > 0) {
      findVehicles = await vehicleModel.find({
        _id: { $in: vehicleIds },
        route: routeId,
        branchCode: branchId
      }).populate("route", "routeNumber");
    } else {
      findVehicles = await vehicleModel.find({
        route: routeId,
        branchCode: branchId
      }).populate("route", "routeNumber");
    }

    if (findVehicles.length === 0) {
      return res.status(200).json([]);
    }

    const vehicleMap = {};
    findVehicles.forEach(v => {
      vehicleMap[v._id.toString()] = {
        economicNumber: v.economicNumber,
        routeNumber: v.route?.routeNumber || "N/A"
      };
    });

    const checklistMap = {};
    const questionTextMap = {};
    const choiceTextMap = {};

    checklistDocs.forEach(cl => {
      const optionsMap = {};
      cl.answers.forEach(q => {
        questionTextMap[q._id.toString()] = q.question;
        q.options.forEach(opt => {
          optionsMap[opt._id.toString()] = opt.action;
          choiceTextMap[opt._id.toString()] = opt.choices;
        });
      });
      checklistMap[cl._id.toString()] = optionsMap;
    });

    const finalData = filledChecklists.map((item, index) => {
      const optionsMap = checklistMap[item.checklistId.toString()] || {};
      const red = [], orange = [], green = [];

      item.answers.forEach(ans => {
        const action = optionsMap[ans.answerId];
        const question = questionTextMap[ans.questionId] || "N/A";
        const answer = choiceTextMap[ans.answerId] || "N/A";
        const comment = ans.comment || null;

        const answerObj = { flag: action, question, answer, comment };
        if (action === "wrong") red.push(answerObj);
        else if (action === "warning") orange.push(answerObj);
        else if (action === "correct") green.push(answerObj);
      });

      let vehicleInfo = {};
      if (assignVehicleData.length > 0) {
        const driverVehicle = assignVehicleData.find(
          d => d._id.toString() === item.driverId.toString()
        );
        vehicleInfo = vehicleMap[driverVehicle?.assignVehicles?.toString()] || {};
      }
      if (!vehicleInfo.economicNumber) {
        vehicleInfo = findVehicles[0] || {};
      }

      return {
        sr: index + 1,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "N/A",
        driverId: item.driverId,
        economicNo: vehicleInfo.economicNumber || "N/A",
        route: vehicleInfo.route?.routeNumber || "N/A",
        red,
        orange,
        green
      };
    });

    res.status(200).json(finalData);
  } catch (error) {
    console.error("❌ Error in FilledChecklistByRouteId:", error);
    res.status(500).json({ message: error.message });
  }
});


const checklistanswerreport = asyncHandler(async (req, res) => {
  try {
    const checklistDocs = await CheckListModel.find();
    const checklistIds = checklistDocs.map(cl => cl._id.toString());

    if (checklistIds.length === 0) {
      return res.status(200).json([]);
    }

    const filledChecklists = await filledCheckListModel.find({
      checklistId: { $in: checklistIds }
    });

    const driverIds = [...new Set(filledChecklists.map(fc => fc.driverId.toString()))];
    const routes = await routeModel.find({ username: { $in: driverIds } });

    const economicVehicleIds = [
      ...new Set(routes.map(r => r.economicNumber?.toString()).filter(Boolean))
    ];
    const vehicles = await vehicleModel.find({ _id: { $in: economicVehicleIds } });

    const vehicleMap = {};
    vehicles.forEach(vehicle => {
      vehicleMap[vehicle._id.toString()] = vehicle.economicNumber;
    });

    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.username.toString()] = {
        routeNumber: route.routeNumber,
        economicNumber: vehicleMap[route.economicNumber?.toString()] || "N/A"
      };
    });

    const checklistMap = {};
    const questionTextMap = {};
    const choiceTextMap = {};

    checklistDocs.forEach(cl => {
      const optionsMap = {};
      cl.answers.forEach(q => {
        questionTextMap[q._id.toString()] = q.question;
        q.options.forEach(opt => {
          optionsMap[opt._id.toString()] = opt.action;
          choiceTextMap[opt._id.toString()] = opt.choices;
        });
      });
      checklistMap[cl._id.toString()] = optionsMap;
    });

    const finalData = filledChecklists.map((item, index) => {
      const optionsMap = checklistMap[item.checklistId.toString()] || {};
      const red = [], orange = [], green = [];

      item.answers.forEach(ans => {
        const action = optionsMap[ans.answerId];
        const question = questionTextMap[ans.questionId] || "N/A";
        const answer = choiceTextMap[ans.answerId] || "N/A";
        const comment = ans.comment || null;

        const answerObj = { flag: action, question, answer, comment };

        if (action === "wrong") red.push(answerObj);
        else if (action === "warning") orange.push(answerObj);
        else if (action === "correct") green.push(answerObj);
      });

      const routeInfo = routeMap[item.driverId.toString()] || {
        routeNumber: "N/A",
        economicNumber: "N/A"
      };

      return {
        sr: index + 1,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "N/A",
        driverId: item.driverId,
        route: routeInfo.routeNumber,
        economicNo: routeInfo.economicNumber,
        red,
        orange,
        green
      };
    });

    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const checklistperroute = asyncHandler(async (req, res) => {
  try {
    const filledChecklists = await filledCheckListModel.find()
      .populate("driverId")
      .populate("BranchId")
      .populate("checklistId");

    const formattedData = filledChecklists.map((item, index) => {
      let redFlagCount = 0, orangeFlagCount = 0, greenFlagCount = 0, othersCount = 0;

      const masterChecklist = item.checklistId;
      item.answers?.forEach((ans) => {
        if (ans.answerId) {
          const question = masterChecklist?.answers?.find(
            (q) => String(q._id) === String(ans.questionId)
          );
          const option = question?.options?.find(
            (o) => String(o._id) === String(ans.answerId)
          );

          if (option?.action === "wrong") redFlagCount++;
          else if (option?.action === "warning") orangeFlagCount++;
          else if (option?.action === "correct") greenFlagCount++;
          else othersCount++;
        } else {
          othersCount++;
        }
      });

      return {
        id: index + 1,
        date: new Date(item.createdAt).toLocaleDateString("en-GB"),
        RouteId: item.BranchId?._id,
        RouteName: item.BranchId?.name || "N/A",
        ChecklistId: masterChecklist?._id,
        BranchId: item.BranchId?._id,
        EconomicNumber: item.driverId?.assignVehicle || "N/A",
        DriverCount: 1,
        RedFlag: redFlagCount,
        OrangeFlag: orangeFlagCount,
        GreenFlag: greenFlagCount,
        Others: othersCount,
        LastFilledAt: item.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      totalRoutes: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error generating checklist per route:", error);
    res.status(500).json({ message: error.message });
  }
});



/////////CHECKLISTS ANSWER REPORT UNIT
const calculateChecklistPerBranchanswerReport = async (branchId) => {
  console.log("branchId", branchId);
  const branchObjectId = new mongoose.Types.ObjectId(branchId);

  const checklist = await CheckListModel.find({ branches: branchObjectId });
  if (!checklist || checklist.length === 0) {
    return null;
  }
  console.log("checklist", checklist);
  let checklistDriverMap = [];

  for (const checklistItem of checklist) {
    const checklistId = checklistItem._id.toString();
    const drivers = checklistItem.driver || [];

    for (const driverId of drivers) {
      checklistDriverMap.push({
        checklistId,
        driverId: driverId.toString(),
      });
    }
  }
  console.log("checklistDriverMap", checklistDriverMap);
  const total = checklistDriverMap.length;

  const filledChecklists = await filledCheckListModel.find({
    $or: checklistDriverMap.map((item) => ({
      checklistId: item.checklistId,
      driverId: item.driverId,
      driverId: item.driverId
    })),
  });

  const filledChecklistMap = new Set(
    filledChecklists.map(
      (fc) => `${fc.checklistId.toString()}_${fc.driverId.toString()}`
    )
  );

  let filled = 0;
  let unfilled = 0;

  for (const item of checklistDriverMap) {
    const key = `${item.checklistId}_${item.driverId}`;
    if (filledChecklistMap.has(key)) {
      filled++;
    } else {
      unfilled++;
    }
  }

  const filledPercentage = total
    ? ((filled / total) * 100).toFixed(2)
    : "0.00";

  const pendingPercentage = total
    ? ((unfilled / total) * 100).toFixed(2)
    : "0.00";

  const branchData = await vehicleModel.findById(branchId);
  const branchName = branchData?.branchName || "Unknown";

  const latestFilled = filledChecklists
    .map(fc => fc.createdAt)
    .sort((a, b) => b - a)[0]; // latest date

  const latestDate = latestFilled
    ? new Date(latestFilled).toLocaleDateString("en-GB") // dd/mm/yyyy
    : "N/A";
  return {
    BranchId: branchId,
    BranchName: branchName,
    TotalChecklist: total,
    FilledChecklist: filled,
    UnfilledChecklist: unfilled,
    CompliancePercentage: `${filledPercentage}%`,
    PendingPercentage: `${pendingPercentage}%`,
    LatestFilledDate: latestDate,


  };
};


const getChecklistPerBranchReportanswerReport = asyncHandler(async (req, res) => {
  try {
    const allChecklists = await CheckListModel.find({});
    const allBranchIds = [
      ...new Set(allChecklists.flatMap(item => item.branches.map(b => b.toString())))
    ];

    const results = [];

    for (const id of allBranchIds) {
      console.log("id", id);
      const branchData = await calculateChecklistPerBranchanswerReport(id);
      if (branchData) results.push(branchData);
    }

    return res.status(200).json(results);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Checklist By Branch ID
const checklistByBranchId = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  try {
    const data = await CheckListModel.find({
      branches: new mongoose.Types.ObjectId(branchId)
    });

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Checklist Answer Report
const checklistAnswerReport = asyncHandler(async (req, res) => {
  try {
    const data = await filledCheckListModel.find();
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  getChecklistPerBranchReport,
  checklistPerRouteData,
  checklistecnomicunit,
  FilledChecklistByBranchId,
  FilledChecklistByRouteId,
  checklistperroute,
  checklistanswerreport,
  getChecklistPerBranchReportanswerReport,
  checklistByBranchId,
  checklistAnswerReport

};
