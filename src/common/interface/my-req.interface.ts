import { StudentProfileEntity } from 'src/modules/student-profiles/entity/student-profile.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';

export interface IMyReq extends Request {
  user: UserEntity;
  profile: StudentProfileEntity;
}
