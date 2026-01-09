import { Validator, ValidationRule } from '../core/Validator';
import { ErrorCode, ValidationError } from '../core/ErrorCodes';

// Helper to create simple sync rules
const createRule = <T>(
    validator: (val: T) => boolean,
    errorCode: ErrorCode,
    message: string,
    params: Record<string, any> = {}
): ValidationRule<T> => {
    return (value: T, ctx, rootData) => {
        // If optional (undefined or null) and not checking for required/notNull, skip
        // But for required/notNull we need to run.
        // We'll handle this inside specific rules or let the rule decide.
        // Generally, we skip validation if value is null/undefined unless the rule is specifically about existence.
        return validator(value) ? null : {
            // Actually Validator.run attaches the errors but the error object needs a field. 
            // The Validator class stores the fieldName.
            // To keep rules pure, we might just return the error data and let Validator attach the field name?
            // Let's adjust Internal Error creation to accept a placeholder or just use context if available.
            // For this simple implementation, we'll return a partial error and let Validator fill field if missing.
            field: '', // filled by Validator
            errorCode,
            message,
            severity: 'error',
            params
        };
    };
};

/*
 * To make this work seamlessly, we need to extend the Validator class.
 * Since we want a Fluent API, we will add methods to the Validator prototype or 
 * use a subclass/mixin approach.
 * For simplicity and type safety, I will implement the rule factories here 
 * and then update the Validator class to use them.
 */

export const Rules = {
    required: (): ValidationRule => (value) => {
        if (value === undefined || value === null || value === '') {
            return { field: '', errorCode: ErrorCode.REQUIRED, message: 'This field is required', severity: 'error' };
        }
        return null;
    },

    notNull: (): ValidationRule => (value) => {
        if (value === null) {
            return { field: '', errorCode: ErrorCode.NOT_NULL, message: 'Value cannot be null', severity: 'error' };
        }
        return null;
    },

    isString: (): ValidationRule => (value) => {
        if (value !== undefined && value !== null && typeof value !== 'string') {
            return { field: '', errorCode: ErrorCode.INVALID_TYPE, message: 'Value must be a string', severity: 'error' };
        }
        return null;
    },

    isNumber: (): ValidationRule => (value) => {
        if (value !== undefined && value !== null && (typeof value !== 'number' || isNaN(value))) {
            return { field: '', errorCode: ErrorCode.INVALID_TYPE, message: 'Value must be a number', severity: 'error' };
        }
        return null;
    },

    min: (min: number): ValidationRule => (value) => {
        if (typeof value === 'number' && value < min) {
            return { field: '', errorCode: ErrorCode.MIN_VALUE, message: `Value must be at least ${min}`, severity: 'error', params: { min } };
        }
        if (typeof value === 'string' && value.length < min) { // Length handling
            return { field: '', errorCode: ErrorCode.MIN_LENGTH, message: `Length must be at least ${min}`, severity: 'error', params: { min } };
        }
        return null;
    },

    max: (max: number): ValidationRule => (value) => {
        if (typeof value === 'number' && value > max) {
            return { field: '', errorCode: ErrorCode.MAX_VALUE, message: `Value must be at most ${max}`, severity: 'error', params: { max } };
        }
        if (typeof value === 'string' && value.length > max) {
            return { field: '', errorCode: ErrorCode.MAX_LENGTH, message: `Length must be at most ${max}`, severity: 'error', params: { max } };
        }
        return null;
    }
};
