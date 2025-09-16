import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { CommentRepository } from 'src/repositories/comment.repository';
import { PostRepository } from 'src/repositories/post.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PostRepository,
    CommentRepository,
    JwtService,
    ConfigService,
    AuthService,
  ],
})
export class UserModule {}
