import { ValidationArguments } from 'class-validator';

export class ValidationMessages {
  static lengthMessage(args: ValidationArguments): string {
    if (args.constraints.length === 2) {
      return `${args.property} must be between ${args.constraints[0]} and ${args.constraints[1]} characters`;
    } else {
      return `The minimum length of the ${args.property} is ${args.constraints[0]} `;
    }
  }

  static stringMessage(args: ValidationArguments): string {
    return `${args.property} must be a string`;
  }

  static numberMessage(args: ValidationArguments): string {
    const { property, value } = args;
    const options = args.constraints[0] || {};

    if (typeof value !== 'number') {
      return `${property} must be a number`;
    }

    if (!options.allowNAN && isNaN(value)) {
      return `${property} must not be NaN`;
    }

    if (!options.allowInfinity && !isFinite(value)) {
      return `${property} must not be Infinity`;
    }

    if (options.maxDecimalPlaces !== undefined) {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > options.maxDecimalPlaces) {
        return `${property} can have a maximum of ${options.maxDecimalPlaces} decimal places`;
      }
    }

    return `${property} is not a valid number`;
  }

  static booleanMessage(args: ValidationArguments): string {
    return `${args.property} must be a boolean`;
  }
}
