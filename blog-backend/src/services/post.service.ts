import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreatePostDto } from 'src/dtos/create-post-dto';
import { UpdatePostDto } from 'src/dtos/update-post-dto';
import { CommentRepository } from 'src/repositories/comment.repository';
import { PostRepository } from 'src/repositories/post.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class PostService {
  // Post service methods would go here
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userRepo: UserRepository,
    private readonly commentRepo: CommentRepository,
  ) {}
  async getAllPosts() {
    const posts = await this.postRepo.find();
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found');
    }
    return posts;
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const authorId = userId;
    if (!authorId) {
      throw new BadRequestException('Author ID is required');
    }
    if (!ObjectId.isValid(authorId)) {
      throw new BadRequestException(
        'Invalid Author ID format.Id must be a single String of 24 hex characters',
      );
    }
    const author = await this.userRepo.findById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    const data = { ...createPostDto, authorId };
    const post = this.postRepo.create(data);
    const savedPost = await this.postRepo.save(post);
    if (!savedPost) {
      throw new InternalServerErrorException('Post creation failed');
    }
    return savedPost;
  }
  async getPostsByUserId(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const postsDoneByUser = await this.postRepo.find({
      where: { authorId: id },
    });
    if (!postsDoneByUser || postsDoneByUser.length === 0) {
      throw new NotFoundException('No posts found for this user');
    }
    return postsDoneByUser;
  }
  async getPostById(id: string) {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postRepo.findById(id);
  }
  async updatePost(id: string, updatePostDto: UpdatePostDto, authorId: string) {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId.toString() !== authorId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }
    Object.assign(post, updatePostDto);
    const updatedPost = await this.postRepo.save(post);
    if (!updatedPost) {
      throw new InternalServerErrorException('Post update failed');
    }
    return { message: 'Post updated successfully', post };
  }
  async removePostById(id: string, authorId: string) {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId.toString() !== authorId) {
      throw new UnauthorizedException(
        'You are unauthorized to delete this post.',
      );
    }
    // Delete the post
    await this.postRepo.delete({ _id: new ObjectId(id) });
    const deletedPost = post;

    // Also delete associated comments
    await this.commentRepo.deleteMany({ postId: id });
    return { message: 'Post deleted successfully', deletedPost };
  }
  async removeAllPosts() {
    return await this.postRepo.clear();
  }
}
