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
import { LevelService } from './level.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { CreateLevelResponse } from './response/create-level.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListLevelResponse } from './response/list-level.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Level')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateLevelDto })
  @ApiOkResponse({ type: CreateLevelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createMarketDto: CreateLevelDto): Promise<any> {
    const data = await this.levelService.create(createMarketDto);
    return CoreApiResponse.success(data);
  }

  @Public()
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListLevelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.levelService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateLevelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.levelService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateLevelDto })
  @ApiOkResponse({ type: CreateLevelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateLevelDto,
  ) {
    const data = await this.levelService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete()
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove() {
    await this.levelService.remove();
    return CoreApiResponse.success(null);
  }
}
