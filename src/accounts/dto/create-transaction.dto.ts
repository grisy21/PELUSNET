import { IsEnum, IsNumber, IsOptional, IsString, IsDate, IsNotEmpty } from 'class-validator';
import { TransactionType } from '../interfaces/accounts.interface';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  fromAccountId: string;

  @IsOptional()
  @IsString()
  toAccountId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
