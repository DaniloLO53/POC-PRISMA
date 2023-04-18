import { ICustomError } from "./ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function duplicatedUserError(): ICustomError {
  const error = new Error(MessagesErrors.INVALID_DATA) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;

  return error;
}
