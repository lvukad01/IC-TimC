import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ResponseMessage } from './response-message.decorator';

interface ApiMessageOptions {
  message: string;
  type?: Type<any>;
}
export const ApiOkMessage = ({ message, type }: ApiMessageOptions) => {
  return applyDecorators(
    ResponseMessage(message),
    ApiOkResponse({ description: message, ...(type ? { type } : {}) }),
  );
};

export const ApiCreatedMessage = ({ message, type }: ApiMessageOptions) => {
  return applyDecorators(
    ResponseMessage(message),
    ApiCreatedResponse({ description: message, ...(type ? { type } : {}) }),
  );
};

export const ApiNoContentMessage = ({ message, type }: ApiMessageOptions) => {
  return applyDecorators(
    ResponseMessage(message),
    ApiNoContentResponse({ description: message, ...(type ? { type } : {}) }),
  );
};
