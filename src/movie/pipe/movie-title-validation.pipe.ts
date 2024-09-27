import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";


@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!value) {
            throw new BadRequestException("The title is required");
        }

        if (value.length <= 2) {
            throw new BadRequestException("The title must have at least 2 characters");
        }

        return value;
    }
}