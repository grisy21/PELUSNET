import { Client } from 'src/clients/entities/client.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  accountNumber: string;

  @Column({ type: 'float', default: 0.0 })
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  openingDate: string;

  @Column({ length: 50, nullable: true })
  accountType: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;
  
  @ManyToOne(() => Client, (client) => client.accounts)
  client: Client;

  @ManyToOne(() => User, (user) => user.createdAccounts)
  createdBy: User;


  @OneToMany(() => Transaction, (transaction) => transaction.fromAccount)
  transactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toAccount)
  receivedTransactions: Transaction[];

  @BeforeInsert()
  generateAccountNumber() {
    this.accountNumber = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(10, '0');
  }
  @BeforeInsert()
  transform() {
    this.accountType = this.accountType.trim().toLowerCase()
  }
}
