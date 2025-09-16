import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from 'src/controllers/post.controller';
import { Post } from 'src/entities/post.entity';
import { CommentRepository } from 'src/repositories/comment.repository';
import { PostRepository } from 'src/repositories/post.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { PostService } from 'src/services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, PostRepository, UserRepository, CommentRepository],
})
export class PostModule {}
