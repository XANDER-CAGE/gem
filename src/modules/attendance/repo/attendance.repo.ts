import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ICreateAttendance } from '../interfaces/create-attendance.interface';
import { tableName } from 'src/common/var/table-name.var';

export class AttendanceRepo {
  private readonly attendaceTable = tableName.attendance;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: ICreateAttendance, knex = this.knex) {
    await knex(this.attendaceTable).insert(dto);
  }

  async findStreakStartDate(profileId: string, knex = this.knex) {
    const data = await knex
      .select('created_at')
      .from(this.attendaceTable)
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .andWhere(function () {
        this.where('success', false).orWhere('is_last_streak', true);
      })
      .orderBy('created_at', 'desc')
      .first();
    return data ? data.created_at : new Date('1970');
  }

  async countSuccess(profileId: string, startDate: Date, knex = this.knex) {
    const data = await knex
      .count('id')
      .from(this.attendaceTable)
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .andWhere(
        'created_at',
        '>',
        startDate.toISOString().replace('T', ' ').replace('Z', ''),
      )
      .andWhere('success', true)
      .first();
    return data.count || 0;
  }
}
