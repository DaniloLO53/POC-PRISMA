import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function passwordUnmatchError(): ICustomError {
  const error = new Error(MessagesErrors.UNMATCH_PASSOWRD) as ICustomError;
  error.statusCode = ClientErrors.BAD_REQUEST;
  error.name = "PasswordUnmatch";

  return error;
}
