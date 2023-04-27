import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";
import { ServerErrors } from "@/utils/statusCodes/serverErrors";

export interface ICustomError extends Error {
  statusCode: ClientErrors | ServerErrors,
  message: MessagesErrors,
  details?: string[]
}
