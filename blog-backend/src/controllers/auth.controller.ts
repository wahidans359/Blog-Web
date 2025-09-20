// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/create-user-dto';
import { LoginDto } from 'src/dtos/login-dto';
import { RefreshTokenDto } from 'src/dtos/refresh-token-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const validateUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!validateUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // return validateUser;
    return this.authService.login(validateUser as User);
  }
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }
  @Post('logout')
  async logout(@Body('userId') userID: string) {
    return await this.authService.logout(userID);
  }
}
