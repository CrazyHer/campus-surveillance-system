import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
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
}
