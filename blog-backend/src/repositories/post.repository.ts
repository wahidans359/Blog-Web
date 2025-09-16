import { DataSource, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Post } from '../entities/post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository extends MongoRepository<Post> {
  constructor(private dataSource: DataSource) {
    super(
      Post,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
  async findById(id: string) {
    return this.findOne({ where: { _id: new ObjectId(id) } });
  }
}
