import { ValidationRule } from '../core/Validator';
import { ErrorCode } from '../core/ErrorCodes';

export const CrossFieldRules = {
    /**
     * Checks if the value equals another field in the root object (e.g. confirmPassword)
     */
    matchesField: (otherFieldName: string, label?: string): ValidationRule => (value, ctx, rootData) => {
        if (rootData && rootData[otherFieldName] !== value) {
            return {
                field: '',
                errorCode: ErrorCode.CROSS_FIELD_INVALID,
                message: `Value must match ${label || otherFieldName}`,
                severity: 'error',
                params: { otherField: otherFieldName }
            };
        }
        return null;
    },

    requiredIf: (otherFieldName: string, expectedValue: any): ValidationRule => (value, ctx, rootData) => {
        if (rootData && rootData[otherFieldName] === expectedValue) {
            if (value === undefined || value === null || value === '') {
                return {
                    field: '',
                    errorCode: ErrorCode.MISSING_REQUIRED,
                    message: `Field is required when ${otherFieldName} is ${expectedValue}`,
                    severity: 'error'
                };
            }
        }
        return null;
    }
};

export const BusinessRules = {
    allowedDomains: (domains: string[]): ValidationRule => (value) => {
        if (typeof value === 'string') {
            const domain = value.split('@')[1];
            if (domain && !domains.includes(domain)) {
                return { field: '', errorCode: ErrorCode.CUSTOM_ERROR, message: `Email domain must be one of: ${domains.join(', ')}`, severity: 'error' };
            }
        }
        return null;
    },

    // Example context-aware rule
    adminOnly: (): ValidationRule => (value, ctx) => {
        if (ctx?.userRole !== 'admin') {
            return { field: '', errorCode: ErrorCode.SECURITY_RISK, message: 'This field is restricted to admins', severity: 'error' };
        }
        return null;
    }
};
