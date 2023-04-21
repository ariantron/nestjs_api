import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @EventPattern('user-created')
  async create(@Body() createUserDto: CreateUserDto, @Res() response) {
    const res = await this.userService.create(createUserDto);
    return response.status(res.statusCode).json(res);
  }

  @Get('/:id')
  async findOne(@Res() response, @Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return response.status(HttpStatus.OK).json(user);
  }

  @Get('/:id/avatar')
  async findOneAvatar(@Res() response, @Param('id') id: string) {
    const avatar = await this.userService.findOneAvatar(id);
    return response.status(HttpStatus.OK).json({ data: avatar });
  }

  @Delete('/:id/avatar')
  async deleteAvatar(@Res() response, @Param('id') id: string) {
    const result = await this.userService.deleteAvatar(id);
    return response.status(HttpStatus.OK).json(result);
  }
}
