import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { CreateAchievementResponse } from './response/create-achievement.response';
import { ListAchievementResponse } from './response/list-achievement.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Roles(Role.app_admin)
  @Post('/create')
  @ApiBody({ type: CreateAchievementDto })
  @ApiOkResponse({ type: CreateAchievementResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() dto: CreateAchievementDto) {
    const data = await this.achievementsService.create(dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @Roles(Role.student)
  @ApiOkResponse({ type: ListAchievementResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  @Get('list')
  async findAll(@Query() dto: PaginationDto, @Req() req: IMyReq) {
    const { total, data } = await this.achievementsService.findAll(
      dto,
      req.profile.id,
    );
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateAchievementResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.achievementsService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Roles(Role.app_admin)
  @Patch(':id')
  @ApiBody({ type: UpdateAchievementDto })
  @ApiOkResponse({ type: CreateAchievementResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    const data = await this.achievementsService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Roles(Role.app_admin)
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param('id') id: string) {
    await this.achievementsService.remove(id);
    return CoreApiResponse.success(null);
  }
}
