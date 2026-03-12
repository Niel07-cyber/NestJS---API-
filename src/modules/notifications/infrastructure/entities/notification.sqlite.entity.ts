import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  metadata: string;
}
