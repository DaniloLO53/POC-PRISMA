import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function postNotFoundError(): ICustomError {
  const error = new Error(MessagesErrors.POST_NOT_FOUND) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;
  error.name = "PostNotFound";

  return error;
}
