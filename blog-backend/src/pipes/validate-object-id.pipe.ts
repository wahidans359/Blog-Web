import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('ID must not be empty');
    }

    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(
        'Invalid ID format. Id must be a single String of 24 hex characters',
      );
    }

    return value;
  }
}
