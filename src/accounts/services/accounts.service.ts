import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { ErrorsService } from 'src/common/service/errors/errors.service';
import { CreateTransactionDto } from '../dto';
import { Transaction } from '../entities';
import { TransactionType } from '../interfaces/accounts.interface';

@Injectable()
export class AccountsService {
  private readonly origin = AccountsService.name;

  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Client) private transactionRepository: Repository<Transaction>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly errorsService: ErrorsService,
  ) {}

  async createAccount(
    clientId: number,
    userId: string,
    accountType: string,
  ): Promise<Account> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!client) throw new BadRequestException('Client not found');
    if (!user) throw new BadRequestException('User not found');

    try {
      const account = this.accountRepository.create({
        client,
        createdBy: user,
        accountType,
        openingDate: new Date().toISOString(),
      });
      return this.accountRepository.save(account);
    } catch (error) {
      this.errorsService.handleDBErrors(error, this.origin);
    }
  }

  async doTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { type, amount, fromAccountId, toAccountId, description } = createTransactionDto;

    // Start a transaction
    return await this.transactionRepository.manager.transaction(async (transactionManager) => {
      // Check if the accounts exist
      const fromAccount = await transactionManager.findOne(Account, { where: { accountNumber: fromAccountId } });
      if (!fromAccount) {
        throw new Error(`Account with ID ${fromAccountId} does not exist`);
      }

      let toAccount: Account | undefined;
      if (toAccountId) {
        toAccount = await transactionManager.findOne(Account, { where: { accountNumber: toAccountId } });
        if (!toAccount) {
          throw new Error(`Account with ID ${toAccountId} does not exist`);
        }
      }

      // Validate transaction type and amount
      if (type === TransactionType.WITHDRAWAL && fromAccount.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Create the transaction
      const transaction = transactionManager.create(Transaction, {
        type,
        amount,
        fromAccount,
        toAccount,
        description,
      });
      await transactionManager.save(Transaction, transaction);

      // Update account balances
      if (type === TransactionType.WITHDRAWAL) {
        fromAccount.balance -= amount;
        await transactionManager.save(Account, fromAccount);
      } else if (type === TransactionType.DEPOSIT) {
        fromAccount.balance += amount;
        await transactionManager.save(Account, fromAccount);
      } else if (type === TransactionType.TRANSFER) {
        if (toAccount) {
          fromAccount.balance -= amount;
          toAccount.balance += amount;
          await transactionManager.save(Account, fromAccount);
          await transactionManager.save(Account, toAccount);
        }
      }

      return transaction;
    });
  }
  async findByClientId(id: number): Promise<Account[]> {
    const accounts = await this.accountRepository.find({
      where: { client: { id }, isActive: true },
    });

    return accounts;
  }
}
