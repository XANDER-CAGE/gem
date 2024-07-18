import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
} from './dto/student-profile.dto';

@ApiTags('Student-Profiles')
@Controller('student-profiles')
export class StudentProfilesController {
  constructor(private readonly studentProfileService: StudentProfilesService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateStudentProfileDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(@Body() createStudent: CreateStudentProfileDto) {
    const data = await this.studentProfileService.create(createStudent);
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
  async findOne(@Param('id') id: string) {
    const data = await this.studentProfileService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(
    @Param('id') id: string,
    @Body() updateProductReview: UpdateStudentProfileDto,
  ) {
    const data = await this.studentProfileService.update(
      id,
      updateProductReview,
    );
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    const data = await this.studentProfileService.remove(id);
    return CoreApiResponse.success(data);
  }
}
