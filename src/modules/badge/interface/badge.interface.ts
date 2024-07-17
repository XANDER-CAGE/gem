export interface IBadge {
  id: string;
  view: object;
  description: string;
  course_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IFindAllBadge {
  total: number;
  data: IBadge[];
}
