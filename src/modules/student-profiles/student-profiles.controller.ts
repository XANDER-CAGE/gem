import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateStudentProfileDto, UpdateStudentProfileDto } from './dto/student-profile.dto';


@ApiTags('Student-Profiles')
@Controller('student-profiles')
export class StudentProfilesController {
  constructor(private readonly studentProfileService: StudentProfilesService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateStudentProfileDto })
  @ApiOkResponse({ type: CoreApiResponse })
  create(@Body() createStudent: CreateStudentProfileDto) {
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
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(
    @Param('id') id: string,
    @Body() updateProductReview: UpdateStudentProfileDto,
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
