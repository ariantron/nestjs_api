import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;
  @IsString()
  @IsNotEmpty()
  readonly avatar: string;
}
