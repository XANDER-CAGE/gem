import { ApiProperty } from '@nestjs/swagger';
import { IdDto } from '../dto/id.dto';

class PaginationRes {
  @ApiProperty()
  total_items: number;
  @ApiProperty()
  total_pages: number;
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  offset: number;
}

// class ErrorRes {
//   @ApiProperty()
//   message: string | string[];
//   @ApiProperty()
//   error: string;
//   @ApiProperty()
//   statusCode: number;
// }

interface IpaginationArg {
  total: number;
  page: number;
  limit: number;
}

export class CoreApiResponse<T, E> {
  @ApiProperty()
  readonly success: boolean;
  @ApiProperty({ example: '17.07.2024, 18:06:33' })
  readonly timestamp: string;
  @ApiProperty()
  readonly error: E;
  @ApiProperty({ type: PaginationRes })
  readonly pagination: PaginationRes;
  @ApiProperty()
  readonly data: T;

  constructor(
    success: boolean,
    data?: T,
    pagination?: IpaginationArg,
    error?: E,
  ) {
    this.success = success;
    this.data = data || null;
    this.timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Tashkent',
    });
    this.error = error;
    this.pagination = pagination ? this.paginate(pagination) : null;
  }

  public static success<TData>(
    data: TData,
    pagination?: IpaginationArg,
  ): CoreApiResponse<TData, null> {
    return new CoreApiResponse(true, data, pagination, null);
  }

  public static error<E>(error?: any): CoreApiResponse<null, E> {
    return new CoreApiResponse(false, null, null, error);
  }

  private paginate(arg: IpaginationArg) {
    const { limit = 10, page = 1, total } = arg;
    return {
      total_items: total,
      total_pages: Math.ceil(total / limit),
      current_page: page,
      limit,
      offset: (page - 1) * limit,
    };
  }
}

export class SuccessRes extends CoreApiResponse<IdDto, null> {
  @ApiProperty({ type: IdDto })
  data: IdDto;
}
