import { GlobalConstants } from "../../common/constants/global";

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQService } from "./rmq.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "rabbit-mq-module",
        transport: Transport.RMQ,
        options: {
          queue: GlobalConstants.RMQ_PRODUCER_QUEUE,
          urls: [GlobalConstants.RMQ_PRODUCER_URL],
          queueOptions: {
            durable: GlobalConstants.RMQ_PRODUCER_QUEUE_DURABLE
          }
        }
      }
    ])
  ],
  controllers: [],
  providers: [RabbitMQService],
  exports: [RabbitMQService]
})
export class RabbitMQModule {}


