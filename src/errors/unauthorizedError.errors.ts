import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function unauthorizedError(): ICustomError {
  const error = new Error(MessagesErrors.UNAUTHORIZED) as ICustomError;
  error.statusCode = ClientErrors.UNAUTHORIZED;
  error.name = "InvalidToken";

  return error;
}
