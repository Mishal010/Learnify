import mongoose from "mongoose";

const lectureSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

lectureSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model("Lecture", lectureSchema);
