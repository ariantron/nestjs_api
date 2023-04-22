import {
  Body,
  Controller,
  Delete,
  Get,
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
  async findOne(@Param('id') id: string, @Res() response) {
    const res = await this.userService.findOne(id);
    return response.status(res.statusCode).json(res);
  }

  @Get('/:id/avatar')
  async findOneAvatar(@Param('id') id: string, @Res() response) {
    const res = await this.userService.findOneAvatar(id);
    return response.status(res.statusCode).json(res);
  }

  @Delete('/:id/avatar')
  async deleteAvatar(@Param('id') id: string, @Res() response) {
    const res = await this.userService.deleteAvatar(id);
    return response.status(res.statusCode).json(res);
  }
}
