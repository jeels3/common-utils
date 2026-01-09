import { ValidationRule } from '../core/Validator';
import { ErrorCode } from '../core/ErrorCodes';

export const PatternRules = {
    matches: (regex: RegExp): ValidationRule => (value) => {
        if (typeof value === 'string' && !regex.test(value)) {
            return { field: '', errorCode: ErrorCode.PATTERN_MISMATCH, message: 'Value does not match required pattern', severity: 'error' };
        }
        return null;
    },

    contains: (substring: string): ValidationRule => (value) => {
        if (typeof value === 'string' && !value.includes(substring)) {
            return { field: '', errorCode: ErrorCode.PATTERN_MISMATCH, message: `Value must contain "${substring}"`, severity: 'error' };
        }
        return null;
    },

    customRule: (predicate: (val: any) => boolean, msg: string): ValidationRule => (value) => {
        if (!predicate(value)) {
            return { field: '', errorCode: ErrorCode.CUSTOM_ERROR, message: msg, severity: 'error' };
        }
        return null;
    }
};
