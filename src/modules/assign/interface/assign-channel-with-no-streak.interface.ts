import { ChannelEntity } from 'src/modules/channel/entity/channel.entity';
import { StreakEntity } from 'src/modules/streaks/entity/streaks.entity';
import { StudentProfileEntity } from 'src/modules/student-profiles/entity/student-profile.entity';

export interface IAssignChannelWithNoStreak {
  channel: ChannelEntity;
  streak: StreakEntity;
  profile: StudentProfileEntity;
  is_done: true;
}
