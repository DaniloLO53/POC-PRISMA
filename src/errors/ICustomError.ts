import { MessagesErrors } from "@/utils/messages/errors.messages";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export interface ICustomError extends Error {
  statusCode: ClientErrors,
  message: MessagesErrors,
  details?: string[]
}
