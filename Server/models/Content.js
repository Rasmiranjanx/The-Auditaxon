const mongoose = require("mongoose");
const slugify = require("slugify");

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "pdf" },
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String, 
      required: true,
      enum: [
        "service", "law", "rule", "form", "bulletin",
        "vat_law", "vat_rule", "blog", "csr", "news", "link", "page",
      ],
      index: true,
    },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, trim: true, maxlength: 500 },
    body: { type: String },
    attachments: [attachmentSchema],
    externalUrl: { type: String, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Content", default: null },
    order: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if one wasn't given
contentSchema.pre("validate", async function () {
  if (!this.slug && this.title) {
    let base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let counter = 1;
    const Content = mongoose.model("Content");
    while (await Content.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${counter++}`;
    }
    this.slug = slug;
  }
});

contentSchema.index({ type: 1, category: 1, order: 1 });

module.exports = mongoose.model("Content", contentSchema);