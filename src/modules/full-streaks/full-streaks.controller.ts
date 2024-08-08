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
} from '@nestjs/common';
import { FullStreaksService } from './full-streaks.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { CreateFullStreakDto } from './dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from './dto/update-full-streaks.dto';
import { CreateFullStreakResponse } from './response/create-full-streaks.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { ListFullStreakResponse } from './response/list-full-streaks.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { FindAllFullStreaksDto } from './dto/find-all.full-streak';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Full-Streak')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('full-streaks')
export class FullStreaksController {
  constructor(private readonly fullStreakService: FullStreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateFullStreakDto })
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createFullStreak: CreateFullStreakDto) {
    const data = await this.fullStreakService.create(createFullStreak);
    return CoreApiResponse.success(data);
  }

  @Public()
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: FindAllFullStreaksDto) {
    const { total, data } = await this.fullStreakService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.fullStreakService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateFullStreakDto })
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateFullStreakDto,
  ) {
    const data = await this.fullStreakService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete()
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove() {
    await this.fullStreakService.remove();
    return CoreApiResponse.success(null);
  }
}
