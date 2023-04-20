import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RMQ_MODULE') private readonly client: ClientProxy) {}

  public send(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }
}
