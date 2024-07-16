import { Inject, Injectable } from '@nestjs/common';
import { ICreateStudentProfile, IFindAllStudentProfile, IUpdateStudentProfile } from './interface/student-profile.intefrace';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesRepo } from './repo/student-profiles.repo';

@Injectable()
export class StudentProfilesService {
  @Inject() private readonly studentService: StudentProfilesRepo;

  create(createMarketDto: ICreateStudentProfile) {
    return this.studentService.create(createMarketDto);
  }

  async findAll(
    findAllStudentProfiles: PaginationDto,
  ): Promise<IFindAllStudentProfile> {
    return await this.studentService.findAll(findAllStudentProfiles);
  }

  findOne(id: string) {
    return this.studentService.findOne(id);
  }

  update(id: string, updateMarketDto: IUpdateStudentProfile) {
    return this.studentService.update(id, updateMarketDto);
  }

  remove(id: string) {
    return this.studentService.deleteOne(id);
  }
}
