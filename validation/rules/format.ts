import { ValidationRule } from '../core/Validator';
import { ErrorCode } from '../core/ErrorCodes';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const FormatRules = {
    email: (): ValidationRule => (value) => {
        if (typeof value === 'string' && value && !EMAIL_REGEX.test(value)) {
            return { field: '', errorCode: ErrorCode.INVALID_EMAIL, message: 'Invalid email address', severity: 'error' };
        }
        return null;
    },

    url: (): ValidationRule => (value) => {
        if (typeof value === 'string' && value && !URL_REGEX.test(value)) {
            return { field: '', errorCode: ErrorCode.INVALID_URL, message: 'Invalid URL', severity: 'error' };
        }
        return null;
    },

    uuid: (): ValidationRule => (value) => {
        if (typeof value === 'string' && value && !UUID_REGEX.test(value)) {
            return { field: '', errorCode: ErrorCode.INVALID_UUID, message: 'Invalid UUID', severity: 'error' };
        }
        return null;
    },

    date: (): ValidationRule => (value) => {
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return { field: '', errorCode: ErrorCode.INVALID_DATE, message: 'Invalid date', severity: 'error' };
            }
        }
        return null;
    },

    future: (): ValidationRule => (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime()) || date <= new Date()) {
            return { field: '', errorCode: ErrorCode.FUTURE_DATE, message: 'Date must be in the future', severity: 'error' };
        }
        return null;
    }
};
