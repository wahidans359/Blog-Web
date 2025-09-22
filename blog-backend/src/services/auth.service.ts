// auth.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/create-user-dto';
import { RefreshTokenDto } from 'src/dtos/refresh-token-dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(createUserDto);
    return this.login(createdUser);
  }
  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: 'user not found' });
    }
    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { password, ...result } = user as any;
    return result as Partial<any>;
  }

  async login(user: Partial<User>) {
    // user is validated (e.g. from local strategy or manual validation)
    try {
      const payload = {
        sub: user._id,
        email: user.email,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret:
          process.env.JWT_ACCESS_SECRET || this.config.get('JWT_ACCESS_SECRET'),
        expiresIn:
          process.env.JWT_ACCESS_EXPIRES_IN ||
          this.config.get('JWT_ACCESS_EXPIRES_IN'),
      });

      // Create refresh token (different secret); optionally include jti
      const refreshToken = this.jwtService.sign(payload, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          this.config.get('JWT_REFRESH_SECRET'),
        expiresIn:
          process.env.JWT_REFRESH_EXPIRES_IN ||
          this.config.get('JWT_REFRESH_EXPIRES_IN'),
      });

      // Store hashed refresh token in DB so you can revoke it later:
      const hashed = await bcrypt.hash(refreshToken, 10);
      await this.usersService.saveRefreshToken(String(user._id), hashed);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const { currentHashedRefreshToken, ...userData } = user as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken, refreshToken, userData };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Login failed',
      });
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const user = await this.userRepository.findById(refreshTokenDto.userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    const matches = await bcrypt.compare(
      refreshTokenDto.refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // issue new tokens and rotate refresh token
    const tokens = await this.login(user);
    if (!tokens) {
      throw new InternalServerErrorException('Token generation failed');
    }
    return tokens;
  }

  async logout(userId: string) {
    try {
      if (!userId) {
        throw new UnauthorizedException('User ID is required for logout');
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      await this.usersService.removeRefreshToken(userId);
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error?.message || 'Logout failed');
    }
  }
}
