interface IpaginationRes {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  offset: number;
}

interface IpaginationArg {
  total: number;
  page: number;
  limit: number;
}

export class CoreApiResponse<Data> {
  readonly success: boolean;
  readonly timestamp: string;
  readonly data: Data | null;
  readonly error: any;
  readonly pagination: IpaginationRes;

  private constructor(
    success: boolean,
    data?: Data,
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

  public static success<TData>(
    data: TData,
    pagination?: IpaginationArg,
  ): CoreApiResponse<TData> {
    return new CoreApiResponse(true, data, pagination, null);
  }

  public static error<TData>(error?: any): CoreApiResponse<TData> {
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
