export interface AskAnswer {
  question: string;
  answer: string;
  points: string[];
  sources: { label: string; href: string }[];
  refused?: boolean;
}
