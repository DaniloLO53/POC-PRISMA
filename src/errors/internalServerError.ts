import { ICustomError } from "./ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ServerErrors } from "@/utils/statusCodes/serverErrors";

export function internalServerError(): ICustomError {
  const error = new Error(MessagesErrors.INTERNAL_SERVER_ERROR) as ICustomError;
  error.statusCode = ServerErrors.INTERNAL_SERVER_ERROR;

  console.log("Internal server errorrrr");
  return error;
}
