// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/create-user-dto';
import { LoginDto } from 'src/dtos/login-dto';

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
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return await this.authService.refreshTokens(body.userId, body.refreshToken);
  }
}
