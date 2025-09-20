/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dtos/create-post-dto';
import { UpdatePostDto } from 'src/dtos/update-post-dto';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { PostService } from 'src/services/post.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get('/user/:id')
  getPostsByUserId(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.postService.getPostsByUserId(id);
  }
  @Get(':id')
  getPostById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.postService.getPostById(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    console.log(req.user);
    return this.postService.createPost(createPostDto, req.user.id as string);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updatePost(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postService.updatePost(
      id,
      updatePostDto,
      req.user.id as string,
    );
  }
  @Delete('/clean')
  removeAllPosts() {
    return this.postService.removeAllPosts();
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removePostById(@Param('id', ValidateObjectIdPipe) id: string, @Req() req) {
    return this.postService.removePostById(id, req.user.id as string);
  }
}
