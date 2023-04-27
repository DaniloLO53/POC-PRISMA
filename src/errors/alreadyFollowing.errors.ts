import { ICustomError } from "../middlewares/ICustomError";
import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function alreadyFollowing(): ICustomError {
  const error = new Error(MessagesErrors.ALREADY_FOLLOWING) as ICustomError;
  error.statusCode = ClientErrors.CONFLICT;
  error.name = "AlreadyFollowingError";

  return error;
}
