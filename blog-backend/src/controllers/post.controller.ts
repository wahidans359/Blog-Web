import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dtos/create-post-dto';
import { UpdatePostDto } from 'src/dtos/update-post-dto';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { PostService } from 'src/services/post.service';

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
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
  @Patch(':id')
  updatePost(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }
  @Delete('/clean')
  removeAllPosts() {
    return this.postService.removeAllPosts();
  }
  @Delete(':id')
  removePostById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.postService.removePostById(id);
  }
}
