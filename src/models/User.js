import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  avatar: { type: String },
  initials: { type: String },
  
  // Patient fields
  age: { type: Number },
  gender: { type: String },
  bloodGroup: { type: String },
  city: { type: String },
  address: { type: String },
  emergencyContact: { type: String },
  medicalHistory: [String],
  allergies: [String],
  pets: [mongoose.Schema.Types.Mixed],
  walletBalance: { type: Number, default: 0 },
  
  // Doctor fields
  specialization: { type: String },
  qualification: { type: String },
  experience: { type: Number },
  hospital: { type: String },
  type: { type: String },
  rating: { type: Number },
  totalReviews: { type: Number },
  consultationFee: { type: Number },
  
  // Appointment references
  upcomingAppointments: [String],
  pastAppointments: [String],
  prescriptions: [String],
  
  joinDate: { type: Date, default: Date.now },
  lastVisit: { type: Date },
  lastLogin: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
