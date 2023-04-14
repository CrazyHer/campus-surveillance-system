import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  nickname: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  avatarFilePath?: string;

  @Column({ nullable: true })
  tel?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
