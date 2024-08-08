import { StudentProfileEntity } from 'src/modules/student-profiles/entity/student-profile.entity';

export class UserEntity {
  id: string;
  profile: StudentProfileEntity;
  created_at: Date;
  updated_at: Date;
  token: string;
  is_deleted: boolean;
  is_blocked: boolean;
  is_archived: boolean;
}
