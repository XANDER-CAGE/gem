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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListStudentProfileResponse } from './response/list-student-profile.response';
import { CreateStudentProfileResponse } from './response/create-student-profile.response';

@ApiTags('Student-Profiles')
@Controller('student-profiles')
@ApiBearerAuth()
export class StudentProfilesController {
  constructor(private readonly studentProfileService: StudentProfilesService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateStudentProfileDto })
  @ApiOkResponse({ type: CreateStudentProfileResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createStudent: CreateStudentProfileDto) {
    const data = await this.studentProfileService.create(createStudent);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListStudentProfileResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.studentProfileService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateStudentProfileResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.studentProfileService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiOkResponse({ type: CreateStudentProfileResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
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
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param('id') id: string) {
    const data = await this.studentProfileService.remove(id);
    return CoreApiResponse.success(data);
  }
}
