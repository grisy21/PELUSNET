import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionType } from '../interfaces/accounts.interface';



@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;
  
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions)
  fromAccount: Account;

  @ManyToOne(() => Account, { nullable: true })
  toAccount: Account | null;

  
}
