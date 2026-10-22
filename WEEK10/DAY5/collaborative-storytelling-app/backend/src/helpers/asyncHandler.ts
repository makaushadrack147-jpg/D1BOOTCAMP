import type { Request, RequestHandler } from "express"

export function asyncHandler(
  handler: (req: Request, res: Parameters<RequestHandler>[1]) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    void handler(req, res).catch(next)
  }
}
