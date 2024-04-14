import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import Joi from 'joi';
import { UserInput } from './types/types';

export const callRequestSchema = Joi.object({
    predefinedInformation: Joi.object({
        address: Joi.string().required(),
        name: Joi.string().required(),
        age: Joi.number().required(),
        sex: Joi.string().optional(),
        emergencyInformation: Joi.string().optional(),
        emergencyContacts: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().required(),
                    phone: Joi.string().required(),
                    email: Joi.string().email().required(),
                    relationship: Joi.string().required(),
                }),
            )
            .optional(),
        healthInformation: Joi.object({
            bloodType: Joi.string().empty().optional(),
            allergies: Joi.array().items(Joi.string()).optional(),
            medications: Joi.array().items(Joi.string()).optional(),
            conditions: Joi.array().items(Joi.string()).optional(),
        }).optional(),
    }).required(),
});

export interface CallRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        predefinedInformation: UserInput;
    };
}
