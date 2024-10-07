import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y números'
    })
    password: string;

    @IsString()
    @MinLength(1)
    fullName: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roles?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}