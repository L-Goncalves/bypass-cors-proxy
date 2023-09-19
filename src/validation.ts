// validation.ts

import Joi from "joi";

export const imageProxyValidation = Joi.object({
  url: Joi.string().uri().required(),
  headers: Joi.string().optional(),
  image: Joi.string().base64().required(),
});

export const proxyValidation = Joi.object({
  url: Joi.string().uri().required(),
  headers: Joi.object().optional(),
  body: Joi.object().required(),
});
