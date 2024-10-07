import { IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
enum AccountType {
  SAVINGS = 'savings',
  BUSINESS = 'business',
}
export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsEnum(AccountType, { message: 'AccountType must be one of: savings or business' })
  accountType: AccountType;

 
}

