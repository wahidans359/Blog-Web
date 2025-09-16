import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @IsNotEmpty({ message: 'Content should not be empty' })
  content: string;

  @IsNotEmpty({ message: 'Author ID should not be empty' })
  authorId: string;
}
