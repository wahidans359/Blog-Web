import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user-dto';
import { UpdateUserDto } from 'src/dtos/update-user-dto';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
// import { JwtService } from '@nestjs/jwt';
@Controller('users')
export class UserController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/me')
  getMe(@Req() req: Request) {
    const authHeader = req.headers.authorization as string;
    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }
    try {
      const token = authHeader.split(' ')[1];
      interface JwtPayload {
        sub: string;
        email: string;
      }
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'jwtAccessSecret',
      });
      return this.userService.getUserById(payload.sub);
    } catch (err) {
      throw new Error(err as string);
    }
  }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getUserById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.getUserById(id);
  }
  @Patch(':id')
  updateUser(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
  @Delete()
  deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }
  @Delete(':id')
  deleteUserById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.deleteUserById(id);
  }
}
