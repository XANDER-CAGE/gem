import { ApiProperty } from '@nestjs/swagger';

// class PaginationRes {
//   @ApiProperty()
//   total_items: number;
//   @ApiProperty()
//   total_pages: number;
//   @ApiProperty()
//   current_page: number;
//   @ApiProperty()
//   limit: number;
//   @ApiProperty()
//   offset: number;
// }

class ErrorRes {
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
  @ApiProperty()
  statusCode: number;
}

interface IpaginationArg {
  total: number;
  page: number;
  limit: number;
}

export class CoreApiResponse {
  @ApiProperty({ example: '17.07.2024, 18:06:33' })
  readonly timestamp: string;
  readonly success: boolean;
  readonly error: any;
  readonly data: any;
  readonly pagination: any;

  constructor(
    success: boolean,
    data?: any,
    pagination?: IpaginationArg,
    error?: any,
  ) {
    this.success = success;
    this.data = data || null;
    this.timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Tashkent',
    });
    this.error = error;
    this.pagination = pagination ? this.paginate(pagination) : null;
  }

  public static success(data: any, pagination?: IpaginationArg) {
    return new CoreApiResponse(true, data, pagination, null);
  }

  public static error(error?: any) {
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

export class ErrorApiResponse extends CoreApiResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: Object, example: null })
  data: null;

  @ApiProperty({ type: Object, example: null })
  pagination: null;

  @ApiProperty({ type: ErrorRes })
  error: ErrorRes;
}
