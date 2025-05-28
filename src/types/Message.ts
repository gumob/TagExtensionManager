/**
 * The message type for Chrome extension messaging.
 */
export type MessageType = 'GET_PROFILE' | 'SET_PROFILE' | 'GET_TAGS' | 'SET_TAGS' | 'COLOR_SCHEME_CHANGED';

/**
 * The message interface for Chrome extension messaging.
 *
 * @property type - The type of the message.
 * @property payload - The payload of the message.
 */
export type Message<T = any> = {
  type: MessageType;
  payload?: T;
};

/**
 * The message response interface for Chrome extension messaging.
 *
 * @property success - Whether the message was processed successfully.
 * @property data - The response data.
 * @property error - The error message if the message processing failed.
 */
export type MessageResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
