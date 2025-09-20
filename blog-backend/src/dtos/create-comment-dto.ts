import { IsNotEmpty } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty({ message: 'Content should not be empty' })
  content: string;

  @IsNotEmpty({ message: 'Post ID should not be empty' })
  postId: string;
}
