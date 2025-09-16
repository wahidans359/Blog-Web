// user.repository.ts
import { DataSource, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends MongoRepository<User> {
  constructor(private dataSource: DataSource) {
    super(
      User,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  async findByEmail(email: string) {
    if (!email) {
      return null;
    }
    return this.findOne({ where: { email } });
  }
  async findById(id: string) {
    return this.findOne({ where: { _id: new ObjectId(id) } });
  }
}
