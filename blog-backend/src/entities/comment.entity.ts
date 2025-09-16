import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Comment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  postId: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
