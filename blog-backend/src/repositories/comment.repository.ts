import { DataSource, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentRepository extends MongoRepository<Comment> {
  constructor(private dataSource: DataSource) {
    super(
      Comment,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
  async findById(id: string) {
    return this.findOne({ where: { _id: new ObjectId(id) } });
  }
}
