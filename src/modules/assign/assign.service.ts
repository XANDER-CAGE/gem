import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { ChannelService } from '../channel/channel.service';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { TransactionService } from '../transaction/transaction.service';
import { StreaksService } from '../streaks/streaks.service';
import { IAssignChannelArg } from '../channel/interface/channel.interface';
import { CreateEarningDto } from '../transaction/dto/create-earning-transaction.dto';

@Injectable()
export class AssignService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly channelService: ChannelService,
    private readonly transactionService: TransactionService,
    private readonly streakService: StreaksService,
  ) {}

  async assignChannel(dto: AssignChannelDto) {
    const profile = await this.profileService.findOne(dto.student_profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    const channel = await this.channelService.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');

    await this.knex.transaction(async (trx) => {
      const streak = await this.getStreak(channel.id, trx);
      const streakId = streak ? streak.id : null;
      const assignChannelToProfileArg: IAssignChannelArg = {
        channel_id: channel.id,
        streak_id: streakId,
        profile_id: profile.id,
      };
      await this.channelService.connectToProfile(
        assignChannelToProfileArg,
        trx,
      );
      const createEarningArg: CreateEarningDto = {
        channel_id: channel.id,
        streak_id: streakId,
        profile_id: profile.id,
      };
      await this.transactionService.createEarning(createEarningArg);
    });
    const earning = await this.transactionService.sumAllEarning(profile.id);
    return earning;
  }

  // TODO: Implement logic
  async getStreak(channelId: string, knex = this.knex) {
    return await this.streakService.findOneByChannelId(channelId, knex);
  }
}
