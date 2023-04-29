import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function commentNotFoundError(): ICustomError {
  const error = new Error(MessagesErrors.COMMENT_NOT_FOUND) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;
  error.name = "CommentNotFound";

  return error;
}
