import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column('bool', {
    default: true
  })
  isActive: boolean;

  @OneToMany(() => Account, account => account.client)
  accounts: Account[];

  @OneToOne(() => User, user => user.client)
  @JoinColumn()
  user: User;

  @BeforeInsert()
    checkFieldsBeforeInsert() {
       if(this.email !== null && this.email !== undefined) {
        this.email = this.email.toLowerCase().trim();
       }
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }
}
