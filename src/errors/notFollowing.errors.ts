import { ICustomError } from "./ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function notFollowing(): ICustomError {
  const error = new Error(MessagesErrors.NOT_FOLLOWING) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;
  error.name = "NotFollowingError";

  return error;
}
