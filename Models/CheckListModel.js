const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const OptionSchema = new Schema({
  action: String,
  choices: String,
});

const AnswerSchema = new Schema({
  question: String,
  image: String,
  options: [OptionSchema],
  required: Boolean,
  instruction: String,
  questionType: String,
  comment: String
});

const ChecklistSchema = new Schema(
  {
    title: String,
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    department: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    position: [{ type: Schema.Types.ObjectId, ref: 'Position' }],
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    // routes: [{ type: Schema.Types.ObjectId, ref: 'routes' }],
    // economicUnit: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", 
    },

    answers: [AnswerSchema],
  },
  { timestamps: true }
);

const Checklist = model('Checklist', ChecklistSchema);

module.exports = Checklist;
