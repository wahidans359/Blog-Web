import { IsNotEmpty } from 'class-validator';
export class RefreshTokenDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  refreshToken: string;
}
