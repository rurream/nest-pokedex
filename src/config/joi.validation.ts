
import * as Joi from "joi";



export const JoiValidationSchema = Joi.object({
    ENVIRONMENT: Joi.required().default('dev'),
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number()

})