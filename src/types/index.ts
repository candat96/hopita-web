export type UserRole = "admin" | "doctor" | "ktv";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  role: UserRole;
  facilityId?: string;
  createdAt: string;
}

export type PatientStatus = "active" | "completed" | "attention" | "inactive";

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  diagnosis: string;
  status: PatientStatus;
  assignedDoctorId: string;
  assignedDoctorName: string;
  currentProtocolId?: string;
  currentProtocolName?: string;
  complianceRate: number;
  lastSessionAt?: string;
  createdAt: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  durationSeconds: number;
  repetitions: number;
  setsPerDay: number;
  safetyNotes?: string;
  category: string;
}

export interface ProtocolExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  durationSeconds: number;
  frequency: string;
  order: number;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  targetCondition: string;
  isTemplate: boolean;
  exercises: ProtocolExercise[];
  durationWeeks: number;
  createdBy: string;
  createdAt: string;
  assignedPatientCount: number;
}

export type SessionStatus = "pending" | "in_progress" | "completed" | "skipped";

export interface ExerciseSession {
  id: string;
  patientId: string;
  patientName: string;
  exerciseId: string;
  exerciseName: string;
  scheduledAt: string;
  completedAt?: string;
  status: SessionStatus;
  score?: number;
  accuracy?: number;
  postureScore?: number;
  durationSeconds?: number;
  romValue?: number;
  videoUrl?: string;
}

export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatarUrl?: string;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  meetingUrl?: string;
  type: "followup" | "initial" | "telehealth";
}

export interface RomDataPoint {
  date: string;
  value: number;
  baseline?: number;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export type NotificationType = "compliance_alert" | "appointment" | "system" | "video_review";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  patientId?: string;
  patientName?: string;
}

export interface VideoReview {
  id: string;
  patientId: string;
  patientName: string;
  exerciseId: string;
  exerciseName: string;
  videoUrl: string;
  referenceVideoUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  status: "pending" | "reviewed";
  feedback?: string;
  annotations?: VideoAnnotation[];
}

export interface VideoAnnotation {
  id: string;
  timestampSeconds: number;
  note: string;
  type: "error" | "improvement" | "good";
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  phone: string;
  logoUrl?: string;
  doctorCount: number;
  patientCount: number;
  createdAt: string;
}

export interface ComplianceDataPoint {
  week: string;
  rate: number;
}

export interface TreatmentHistoryEntry {
  id: string;
  protocolName: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
  notes?: string;
}
