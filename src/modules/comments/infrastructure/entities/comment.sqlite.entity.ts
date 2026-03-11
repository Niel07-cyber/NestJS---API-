import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  postId: string;

  @Column()
  authorId: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
