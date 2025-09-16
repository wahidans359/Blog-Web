import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from 'src/dtos/create-comment-dto';
import { UpdateCommentDto } from 'src/dtos/update-comment-dto';
import { CommentRepository } from 'src/repositories/comment.repository';
import { PostRepository } from 'src/repositories/post.repository';

@Injectable()
export class CommentService {
  // Comment service methods would go here
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const post = await this.postRepo.findById(createCommentDto.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const comment = this.commentRepo.create(createCommentDto);
    if (!comment) {
      throw new Error('Comment creation failed');
    }
    const savedComment = await this.commentRepo.save(comment);
    if (!savedComment) {
      throw new Error('Comment saving failed');
    }
    post.commentIds.push(savedComment._id);
    await this.postRepo.save(post);
    return savedComment;
  }
  async getAllComments() {
    const comments = await this.commentRepo.find();
    if (!comments || comments.length === 0) {
      throw new Error('No comments found');
    }
    return comments;
  }
  async getCommentsByPostId(id: string) {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    const comments = await this.commentRepo.find({
      where: { postId: id },
    });
    if (!comments || comments.length === 0) {
      throw new Error('No comments found for this post');
    }
    return comments;
  }
  async getCommentById(id: string) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }
  async getAllCommentsFromUser(id: string) {
    const comments = await this.commentRepo.find({
      where: { authorId: id },
    });
    if (!comments || comments.length === 0) {
      throw new Error('No comments found for this user');
    }
    return comments;
  }
  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepo.save(comment);
    if (!updatedComment) {
      throw new Error('Comment update failed');
    }
    return { message: 'Comment updated successfully', updatedComment };
  }
  async deleteAllComments() {
    return this.commentRepo.clear();
  }
  async deleteCommentById(id: string) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    await this.commentRepo.delete(id);
    //TODO Remove comment ID from associated post's commentIds array
    return { message: 'Comment deleted successfully', deletedComment: comment };
  }
}
