import { ICustomError } from "./ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function userNotFoundError(): ICustomError {
  const error = new Error(MessagesErrors.USER_NOT_FOUND) as ICustomError;
  error.statusCode = ClientErrors.NOT_FOUND;
  error.name = "UserNotFound";

  return error;
}
