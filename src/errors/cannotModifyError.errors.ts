import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function cannotModifyError(): ICustomError {
  const error = new Error(MessagesErrors.CANNOT_MODIFY) as ICustomError;
  error.statusCode = ClientErrors.UNAUTHORIZED;
  error.name = "CannotModifyContent";

  return error;
}
