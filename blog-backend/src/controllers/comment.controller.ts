import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from 'src/dtos/create-comment-dto';
import { UpdateCommentDto } from 'src/dtos/update-comment-dto';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { CommentService } from 'src/services/comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get()
  getAllComments() {
    return this.commentService.getAllComments();
  }
  @Get('/post/:id')
  getAllCommentsFromPost(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.commentService.getCommentsByPostId(id);
  }
  @Get('/user/:id')
  getAllCommentsFromUser(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.commentService.getAllCommentsFromUser(id);
  }
  @Get(':id')
  getCommentById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.commentService.getCommentById(id);
  }
  @Post()
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }
  @Patch(':id')
  updateComment(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, updateCommentDto);
  }
  @Delete('/clean')
  deleteAllComments() {
    return this.commentService.deleteAllComments();
  }
  @Delete(':id')
  deleteCommentById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.commentService.deleteCommentById(id);
  }
}
