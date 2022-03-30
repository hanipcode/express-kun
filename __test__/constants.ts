export const ROUTE_FN_TYPE = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
} as const;
export const OVERRIDEN_ROUTES = [
  ROUTE_FN_TYPE.GET,
  ROUTE_FN_TYPE.POST,
  ROUTE_FN_TYPE.PUT,
  ROUTE_FN_TYPE.DELETE,
];
