import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject("rabbit-mq-module") private readonly client: ClientProxy
  ) {}

  public send(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }
}