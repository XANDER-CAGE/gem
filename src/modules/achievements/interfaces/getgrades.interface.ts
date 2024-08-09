export class IGetAGrades {
  achievement_id: string;
  comp_id: string;
  component_name: string;
  grades: [{ profile_id: string }];
}
