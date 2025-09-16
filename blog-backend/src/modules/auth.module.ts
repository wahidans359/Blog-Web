import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/services/auth.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { UserModule } from './user.module';
import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { PostRepository } from 'src/repositories/post.repository';
import { CommentRepository } from 'src/repositories/comment.repository';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_SECRET || config.get('JWT_SECRET'),
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    UserRepository,
    PostRepository,
    CommentRepository,
    JwtService,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
