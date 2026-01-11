
export type BirthType = 'Vaginal' | 'C-Section' | 'Vaginal with Intervention' | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  kids: number;
  kidsAges: string;
  birthType: BirthType;
  medicalNotes: string;
  diagnoses: string;
  location?: string;
}

export interface DailyCheckIn {
  date: string;
  happiness: number; // 1-5
  pain: number; // 1-5
  nausea: number; // 1-5
  swelling: number; // 1-5
  fatigue: number; // 1-5
  milkSupply: number; // 1-5
  notes?: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  content: string;
  timestamp: number;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  timestamp: number;
  location: string;
  replies?: ForumReply[];
}

export interface CommunityEvent {
  id: string;
  organizerName: string;
  locationName: string;
  locationType: 'Park' | 'Coffee Shop' | 'Other';
  date: string;
  time: string;
  description: string;
  attendees: string[];
}
