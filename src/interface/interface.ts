export interface FocusSession {
  id: string;
  goal: string;
  durationMin: number;
  startedAt: number;
  goalCompleted?: boolean;
}
