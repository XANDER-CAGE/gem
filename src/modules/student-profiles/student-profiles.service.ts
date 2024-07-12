import { Injectable } from '@nestjs/common';
import { CreateStudentProfileDto, UpdateStudentProfileDto } from './dto/student-profile.dto';

@Injectable()
export class StudentProfilesService {
  create(createStudentProfileDto: CreateStudentProfileDto) {
    return 'This action adds a new studentProfile';
  }

  findAll() {
    return `This action returns all studentProfiles`;
  }

  findOne(id: string) {
    return `This action returns a #${id} studentProfile`;
  }

  update(id: string, updateStudentProfileDto: UpdateStudentProfileDto) {
    return `This action updates a #${id} studentProfile`;
  }

  remove(id: string) {
    return `This action removes a #${id} studentProfile`;
  }
}
