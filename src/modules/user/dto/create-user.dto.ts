import { IsNotEmpty, IsString, IsEmail, IsAlpha } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsAlpha()
  @IsNotEmpty()
  readonly first_name: string;

  @IsAlpha()
  @IsNotEmpty()
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  readonly avatar: string;
}
