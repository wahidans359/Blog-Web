import { IsOptional, IsString } from 'class-validator';
export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;
}
