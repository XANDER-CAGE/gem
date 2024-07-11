interface IpaginationArg {
  total: number
  page: number;
  limit: number;
}

interface IpaginationRes {
  limit: number
  offset: number
}
