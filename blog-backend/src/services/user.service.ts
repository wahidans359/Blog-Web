/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user-dto';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user-dto';
import { PostRepository } from 'src/repositories/post.repository';
import { CommentRepository } from 'src/repositories/comment.repository';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  // User service methods would go here
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    // Logic to create a user
    const existingUser = await this.userRepo.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    if (!hashedPassword) {
      throw new ConflictException('Password hashing failed');
    }
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });
    if (!user) {
      throw new InternalServerErrorException('User creation failed');
    }
    const savedUser = await this.userRepo.save(user);
    if (!savedUser) {
      throw new InternalServerErrorException('User saving failed');
    }
    const { password, currentHashedRefreshToken, ...result } = savedUser as any;
    // const { password,  } = savedUser;
    // const { password, ...result } = savedUser as any;
    // return result as Partial<User>;
    // return createdData;
    return result as Partial<User>;
  }
  async getAllUsers() {
    // Logic to get all users
    const allUsers = await this.userRepo.find();
    if (!allUsers || allUsers.length === 0) {
      throw new NotFoundException('No users found');
    }
    const usersWithoutPasswords = allUsers.map((user) => {
      const { password, ...rest } = user as any;
      return rest as Partial<User>;
    });
    return usersWithoutPasswords;
  }
  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user as any;
    return result as Partial<User>;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }
    if (updateUserDto.password) {
      const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      if (!hashedPassword) {
        throw new ConflictException('Password hashing failed');
      }
      updateUserDto.password = hashedPassword;
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepo.save(user);
    if (!updatedUser) {
      throw new ConflictException('User update failed');
    }
    const { password, ...result } = updatedUser as any;
    const tokens = await this.authService.login(updatedUser);
    if (!tokens) {
      throw new InternalServerErrorException('Token generation failed');
    }
    return { accessToken: tokens, ...(result as Partial<User>) };
  }
  async deleteUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.userRepo.delete(id);
      const userPosts = await this.postRepo.find({ where: { authorId: id } });
      for (const post of userPosts) {
        await this.commentRepo.deleteMany({ postId: post._id.toString() });
      }
      await this.postRepo.deleteMany({ authorId: id });
      await this.commentRepo.deleteMany({ userId: id });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new ConflictException('User deletion failed');
    }
  }
  async deleteAllUsers() {
    const deletedUsers = await this.userRepo.clear();
    const deletedPosts = await this.postRepo.clear();
    const deletedComments = await this.commentRepo.clear();
    return {
      message: 'All users, posts, and comments deleted successfully',
      deletedUsers,
      deletedPosts,
      deletedComments,
    };
  }
  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.currentHashedRefreshToken = refreshToken;
    await this.userRepo.save(user);
  }
  async removeRefreshToken(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.currentHashedRefreshToken = '';
    await this.userRepo.save(user);
  }
  async getCurrentUser(req: any) {
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
      const { currentHashedRefreshToken, ...currentUserData } =
        await this.getUserById(payload.sub);
      return {
        message: 'Authorization Successful',
        data: currentUserData,
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
