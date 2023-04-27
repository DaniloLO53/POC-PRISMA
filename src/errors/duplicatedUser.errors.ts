import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function duplicatedUserError(): ICustomError {
  const error = new Error(MessagesErrors.DUPLICATED_EMAIL) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;
  error.name = "DuplicatedEmailError";

  return error;
}
