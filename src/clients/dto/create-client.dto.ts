import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber, IsOptional, IsBoolean, Matches, IsUUID } from 'class-validator';

export class CreateClientDto {
  

  @IsNotEmpty()
  @Matches(/^\d{3}-\d{3}-\d{4}$/, { message: 'El numero de telefono debe tener este formato xxx-xxx-xxxx' })
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  @IsString()
  userId: string;
}
