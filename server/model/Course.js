import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      default:
        "https://newsroundtheclock.com/wp-content/uploads/2023/10/online-course-blog-header.jpg",
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: 1, instructor: 1 }, { unique: true });

export default mongoose.model("Course", courseSchema);
