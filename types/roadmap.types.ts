export type RoadmapStatus = "completed" | "in-progress" | "planned" | "future";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  eta?: string;
  tags?: string[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
}
