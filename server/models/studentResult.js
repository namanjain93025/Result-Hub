// models/StudentResult.js

import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    theoryGrade: {
      type: String,
      default: "-",
      trim: true,
    },

    practicalGrade: {
      type: String,
      default: "-",
      trim: true,
    },
  },
  {
    _id: false,
  }
);
//subjectSchema is embedded inside another studentSchema.
const studentResultSchema = new mongoose.Schema(
  {
    enrollmentNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    batch: {
      type: Number,
      required: true,
    },
    section : {
       type : String,
       required : true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    // academicSession: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    studentType: {
      type: String,
      enum: ["Regular", "Ex"],
      default: "Regular",
    },

    resultStatus: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Unknown",
    },

    sgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    subjects: {
      type: [subjectSchema],
      default: [],
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate result for the same student and semester
//  Unique Compound Index
studentResultSchema.index(
  {
    enrollmentNumber: 1,
    semester: 1,
    // academicSession: 1,
    studentType: 1,
  },
  {
    unique: true,
  }
);

// Make leaderboard and branch report queri faster
//Performance Index
studentResultSchema.index({
  branch: 1,
  semester: 1,
//   academicSession: 1,
  sgpa: -1,
});

const StudentResult = mongoose.model("StudentResult", studentResultSchema);
export default StudentResult;