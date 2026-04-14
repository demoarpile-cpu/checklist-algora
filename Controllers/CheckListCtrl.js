const Schema = require("../Models/CheckListModel.js");
const FillSchema = require("../Models/FillCheckListModel.js");
const asyncHandler = require("express-async-handler");
const { getquestionsbyId, getanswerssbyId } = require("../Utills/Helpers.js");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

// 🛠️ Cloudinary Config
cloudinary.config({
  cloud_name: "dfporfl8y",
  api_key: "244749221557343",
  api_secret: "jDkVlzvkhHjb81EvaLjYgtNtKsY",
});

// 📦 Multer Setup (memoryStorage)
const uploadData = multer({ storage: multer.memoryStorage() });

// 📤 Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: filename, folder: "checklists" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Upload base64 image
const uploadBase64ToCloudinary = async (base64String, filename) => {
  return await cloudinary.uploader.upload(base64String, {
    resource_type: "image",
    public_id: filename,
    folder: "checklists/fill-doodles",
  });
};


const fillchecklist = asyncHandler(async (req, res) => {
  try {
    const { checklistId, driverId, signature, BranchId, routeId } = req.body;
    let answers = JSON.parse(req.body.answers || "[]");
    const files = req.files || [];
    let imageIds = req.body.imageIds || [];

    if (typeof imageIds === "string") {
      imageIds = [imageIds];
    }

    const imageMap = {};
    imageIds.forEach((id, index) => {
      imageMap[id] = files[index];
    });

    if (!checklistId || !driverId || !signature || !BranchId || !routeId || answers.length === 0) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }

    const alreadyFilled = await FillSchema.findOne({ checklistId, driverId, BranchId, routeId });
    if (alreadyFilled) {
      return res.status(400).json({
        message: "You have already filled this checklist.",
        success: false,
      });
    }

    answers = await Promise.all(
      answers.map(async (ans) => {
        if (typeof ans.answer === "string" && ans.answer.startsWith("__image__")) {
          const imageKeysString = ans.answer.replace("__image__", "");
          const imageKeys = imageKeysString.split(",");
          const uploadedUrls = [];

          for (let key of imageKeys) {
            const file = imageMap[key];
            if (file) {
              const imageUrl = await uploadToCloudinary(
                file.buffer,
                `filled_checklist_images/${key}_${Date.now()}`
              );
              uploadedUrls.push(imageUrl);
            }
          }

          return { ...ans, answer: uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls };
        }

        if (typeof ans.answer === "string" && ans.answer.startsWith("data:image/")) {
          const uploadResult = await uploadBase64ToCloudinary(ans.answer, `doodle_${Date.now()}`);
          return { ...ans, answer: uploadResult.secure_url };
        }

        return ans;
      })
    );

    const filledChecklist = await FillSchema.create({
      checklistId,
      driverId,
      BranchId,
      signature,
      answers,
      routeId,
    });

    res.status(201).json({
      message: "Checklist filled successfully",
      success: true,
      data: filledChecklist,
    });
  } catch (error) {
    console.error("Checklist Fill Error:", error.message);
    res.status(500).json({
      message: "Failed to fill checklist",
      error: error.message,
      success: false,
    });
  }
});


const getallchecklist = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find()
      .populate("department", "departmentName")
      .populate("position", "positionName")
      .populate("branches", "branchName")
      .populate("created_by", "username");

    const modifiedData = data.map((checklist) => ({
      ...checklist._doc,
      totalQuestions: checklist.answers.length,
    }));

    res.status(200).json({ data: modifiedData, message: "Checklist fetched successfully", success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, message: "Checklist not fetched", success: false });
  }
});

const getchecklistByDriverid = asyncHandler(async (req, res) => {
  try {
    const { driverId } = req.query;

    let query = {};
    if (driverId) {
      query.driver = driverId;
    }
    console.log(query, "query");

    const data = await Schema.find(query)
      .populate("driver", "username")
      .populate("branches", "branchName")
      .populate("created_by", "username");

    const modifiedData = data.map((checklist) => ({
      ...checklist._doc,
      totalQuestions: checklist.answers.length,
    }));

    res.status(200).json({
      data: modifiedData,
      message: "Checklist fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Checklist not fetched",
      success: false,
    });
  }
});

// ✅ Get checklist by Id
const getchecklistbyid = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findById(req.params.id)
      .populate("branches", "branchName")
      .populate("created_by", "username")
      .populate("department", "departmentName")
      .populate("position", "positionName");

    if (!data) {
      return res.status(404).json({
        message: "Checklist not found",
        success: false,
      });
    }

    const modifiedData = {
      ...data._doc,
      totalQuestions: data.answers.length,
    };

    res.status(200).json({
      data: modifiedData,
      message: "Checklist fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Checklist not fetched",
      success: false,
    });
  }
});

// ✅ Add checklist
const addchecklist = asyncHandler(async (req, res) => {
  try {
    const title = req.body.title;
    const driver = req.body.driver;
    const created_by = req.body.created_by;

    // Parse array fields from FormData
    const branches = JSON.parse(req.body.branches || "[]");
    const department = JSON.parse(req.body.department || "[]");
    const position = JSON.parse(req.body.position || "[]");
    const answers = JSON.parse(req.body.answers || "[]");

    const files = req.files || [];
    let imageIndex = 0;

    const processedAnswers = await Promise.all(
      answers.map(async (ans) => {
        let imageUrl = "";

        if (ans.questionType === "Upload Image With Point To Select" && files?.[imageIndex]) {
          const file = files[imageIndex];
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            `checklist_questions/${Date.now()}_${imageIndex}`
          );
          imageUrl = uploadResult;
          imageIndex++;
        }

        const options =
          ans.options && ans.options.length > 0
            ? ans.options.map((opt) => ({
                _id: opt._id || new mongoose.Types.ObjectId(),
                action: opt.action || "correct",
                choices: opt.choices || "",
              }))
            : [
                {
                  _id: new mongoose.Types.ObjectId(),
                  action: "correct",
                  choices: "",
                },
              ];

        console.log("ans", ans);

        return {
          question: ans.question || "",
          questionType: ans.questionType,
          instruction: ans.instruction || "",
          required: ans.required === true,
          comment: ans.comment || "",
          options,
          image: imageUrl,
        };
      })
    );

const checklistData = {
      title,
      driver,
      created_by,
      position,
      department,
      branches,
      answers: processedAnswers,
    };

    const checklist = new Schema(checklistData);
    const saved = await checklist.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Checklist Create Error =>", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
});

const updatechecklist = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      data,
      message: "Checklist updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Checklist not updated",
      success: false,
    });
  }
});

// ✅ Delete Checklist + associated filled checklists
const deletechecklist = asyncHandler(async (req, res) => {
  try {
    const checklistId = req.params.id;

    const data = await Schema.findByIdAndDelete(checklistId);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    await FillSchema.deleteMany({ checklistId });

    res.status(200).json({
      success: true,
      message: "Checklist and all associated filled responses deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Checklist deletion failed",
      error: error.message,
    });
  }
});

// ✅ Delete filled checklist only
const deletefillchecklist = asyncHandler(async (req, res) => {
  try {
    const data = await FillSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data,
      message: "Fill checklist deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Fill checklist not deleted",
      success: false,
    });
  }
});

// ✅ Aggregated response
const getresponse = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.aggregate([
      {
        $lookup: {
          from: "branches",
          localField: "branches._id",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "units",
          localField: "units._id",
          foreignField: "_id",
          as: "unitDetails",
        },
      },
      { $unwind: { path: "$unitDetails", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "routes",
          localField: "routes._id",
          foreignField: "_id",
          as: "routeDetails",
        },
      },
      { $unwind: { path: "$routeDetails", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "checklists",
          localField: "checklistId._id",
          foreignField: "_id",
          as: "checklistDetails",
        },
      },
      { $unwind: { path: "$checklistDetails", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "driverId._id",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      { $unwind: { path: "$driverDetails", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          checklistTitle: "$checklistDetails.title",
          driverName: {
            $concat: ["$driverDetails.firstname", " ", "$driverDetails.lastname"],
          },
          branchCode: "$branchDetails.branchCode",
          unitNumber: "$unitDetails.unitNumber",
          routeNumber: "$routeDetails.routeNumber",
          answers: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in aggregation:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

const getfillchecklist = asyncHandler(async (req, res) => {
  try {
    const { checklistId } = req.params;

    const filter = {};
    if (checklistId) filter.checklistId = checklistId;

    const data = await FillSchema.find(filter)
      .populate("checklistId", "title answers")
      .populate("driverId", "username")
      .populate("BranchId", "_id");

    const formatted = data.map((entry) => {
      const checklist = entry.checklistId;
      const filledAnswers = entry?.answers;

      const structuredAnswers = filledAnswers.map((filled) => {
        const question = checklist?.answers.find(
          (q) => q._id?.toString() === filled.questionId?.toString()
        );

        const selectedOption = question?.options?.find(
          (opt) => opt._id?.toString() === filled.answerId?.toString()
        );

        return {
          question: question?.question || "Question not found",
          type: question?.questionType || "N/A",
          required: question?.required || false,
          selectedAnswer: {
            choice: selectedOption?.choices || "Option not found",
            action: selectedOption?.action || "N/A",
          },
          comment: filled.comment || "",
        };
      });

      return {
        fillId: entry._id,
        checklistTitle: checklist?.title || "N/A",
        driver: entry.driverId?.username || "Unknown",
        answers: structuredAnswers,
        signature: entry.signature,
        createdAt: entry.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Filled checklist fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error in getfillchecklist:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filled checklist",
      error: error.message,
    });
  }
});

// ✅ Get all filled checklists
const getAllCheckListData = asyncHandler(async (req, res) => {
  try {
    const response = await FillSchema.find()
      .populate("checklistId", "title answers")
      .populate("driverId", "username")
      .populate("BranchId", "branchName")
      .populate("routeId", "routeNumber");

    const formatted = response.map((entry) => {
      const checklist = entry.checklistId;
      const filledAnswers = entry?.answers;

      const structuredAnswers = filledAnswers.map((filled) => {
        const question = checklist?.answers.find(
          (q) => q._id?.toString() === filled.questionId?.toString()
        );

        const selectedOption = question?.options?.find(
          (opt) => opt._id?.toString() === filled.answerId?.toString()
        );

        return {
          questionId: filled.questionId,
          question: question?.question || "N/A",
          type: question?.questionType || "N/A",
          required: question?.required || false,
          instruction: question?.instruction || "",
          answerComment: filled?.answerComment || "",
          selectedAnswer: {
            answerId: filled?.answerId || null,
            value: filled?.answer || "",
            choice: selectedOption?.choices || null,
            action: selectedOption?.action || null,
          },
        };
      });

      return {
        fillId: entry._id,
        checklistTitle: checklist?.title || "N/A",
        driver: entry.driverId?.username || "Unknown",
        branch: entry.BranchId?.branchName || "",
        routeNumber: entry.routeNumber?.routeNumber || "",
        signature: entry.signature || null,
        answers: structuredAnswers,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "All filled checklists fetched successfully",
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch filled checklist data",
      error: error.message,
    });
  }
});

// ✅ Get all filled checklists by driverId
const getAllCheckListDatabyDriverId = asyncHandler(async (req, res) => {
  try {
    const response = await FillSchema.find({ driverId: req.params.driverId })
      .populate("checklistId", "title answers")
      .populate("driverId", "username")
      .populate("BranchId", "branchName");

    const formatted = response.map((entry) => {
      const checklist = entry.checklistId;
      const filledAnswers = entry?.answers;

      const structuredAnswers = filledAnswers.map((filled) => {
        const question = checklist?.answers.find(
          (q) => q._id?.toString() === filled.questionId?.toString()
        );

        const selectedOption = question?.options?.find(
          (opt) => opt._id?.toString() === filled.answerId?.toString()
        );

        return {
          questionId: filled.questionId,
          question: question?.question || "N/A",
          type: question?.questionType || "N/A",
          required: question?.required || false,
          instruction: question?.instruction || "",
          answerComment: filled?.answerComment || "",
          selectedAnswer: {
            answerId: filled?.answerId || null,
            value: filled?.answer || "",
            choice: selectedOption?.choices || null,
            action: selectedOption?.action || null,
          },
        };
      });

      return {
        fillId: entry._id,
        checklistTitle: checklist?.title || "N/A",
        driver: entry.driverId?.username || "Unknown",
        branch: entry.BranchId?.branchName || "",
        signature: entry.signature || null,
        answers: structuredAnswers,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "All filled checklists fetched successfully",
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch filled checklist data",
      error: error.message,
    });
  }
});

// ========================== EXPORTS ==========================
module.exports = {
  fillchecklist,
  getallchecklist,
  getchecklistByDriverid,
  getchecklistbyid,
  addchecklist,
  updatechecklist,
  deletechecklist,
  deletefillchecklist,
  getresponse,
  getfillchecklist,
  getAllCheckListData,
  getAllCheckListDatabyDriverId,
  uploadData
};