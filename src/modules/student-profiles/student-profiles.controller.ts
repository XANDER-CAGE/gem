import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateStudentDto } from '../students/dto/update-student.dto';
import { CreateStudentProfileDto } from './dto/student-profile.dto';


@ApiTags('Student-Profiles')
@Controller('student-profiles')
export class StudentProfilesController {
  constructor(private readonly studentProfileService: StudentProfilesService) {}

  @ApiOperation({ summary: 'Create new student' })
  @Post('/create')
  @ApiBody({ type: CreateStudentDto })
  @ApiOkResponse({ type: CoreApiResponse })
  create(@Body() createStudent: CreateStudentProfileDto): any {
    const data = this.studentProfileService.create(createStudent);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.studentProfileService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  findOne(@Param('id') id: string) {
    return this.studentProfileService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateStudentDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(
    @Param('id') id: string,
    @Body() updateProductReview: UpdateStudentDto,
  ) {
    return this.studentProfileService.update(id, updateProductReview);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  remove(@Param('id') id: string) {
    return this.studentProfileService.remove(id);
  }
}
