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
import { StreaksService } from './streaks.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { CreateStreakDto } from './dto/create-streaks.dto';
import { UpdateStreakDto } from './dto/update-streaks.dto';
import { CreateStreakResponse } from './response/create-streaks.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListStreaksResponse } from './response/list-streak.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { FindAllStreaksDto } from './dto/find-all.streaks.dto';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiTags('Streaks')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Roles(Role.app_admin)
  @Post('/create')
  @ApiBody({ type: CreateStreakDto })
  @ApiOkResponse({ type: CreateStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createStreak: CreateStreakDto): Promise<any> {
    const data = await this.streaksService.create(createStreak);
    return CoreApiResponse.success(data);
  }

  @Public()
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListStreaksResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: FindAllStreaksDto) {
    const { total, data } = await this.streaksService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Roles(Role.student)
  @ApiOperation({ summary: 'Get one' })
  @Get('my')
  @ApiOkResponse({ type: CreateStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async my(@Req() req: IMyReq) {
    const data = await this.streaksService.myStreak(req.profile.id);
    return CoreApiResponse.success(data);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.streaksService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @Roles(Role.app_admin)
  @ApiBody({ type: UpdateStreakDto })
  @ApiOkResponse({ type: CreateStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(@Param('id') id: string, @Body() updateStreak: UpdateStreakDto) {
    const data = await this.streaksService.update(id, updateStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete()
  @Roles(Role.app_admin)
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove() {
    await this.streaksService.remove();
    return CoreApiResponse.success(null);
  }
}
