import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Username should not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
