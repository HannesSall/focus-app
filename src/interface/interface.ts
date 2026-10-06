export interface FocusSession {
  id: string;
  goal: string;
  durationMin: number;
  startedAt: number;
  goalCompleted?: boolean;
  flips: number; // antal gånger telefonen vänts upp under passet
  leaves: number; // antal gånger man lämnat appen under passet
}
