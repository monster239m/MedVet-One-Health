import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  disease: { type: String },
  totalFee: { type: Number, required: true },
  durationMins: { type: Number },
  status: { type: String, default: 'COMPLETED' },
  medicinesDelivered: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
