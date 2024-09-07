import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ICreateAttendance } from '../interfaces/create-attendance.interface';

export class AttendanceRepo {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: ICreateAttendance, knex = this.knex) {
    await knex('gamification.attendance').insert(dto);
  }

  async findStreakStartDate(profileId: string, knex = this.knex) {
    return await knex
      .select('created_at')
      .from('gamification.attendance')
      .whereNull('deleted_at')
      .andWhere('student_id', profileId)
      .andWhere(function () {
        this.where('is_last_streak', true).orWhere('success', false);
      })
      .orderBy('created_at', 'desc')
      .first();
  }

  async countSuccess(profileId: string, startDate: Date, knex = this.knex) {
    const date = new Date(startDate);
    const data = await knex
      .count('id')
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .andWhere(
        'created_at',
        '>',
        date.toISOString().replace('T', ' ').replace('Z', ''),
      )
      .andWhere('success', true)
      .first();
    return data.count || 0;
  }
}
