import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rmq.service';
import configuration from '../../config/configuration';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_MODULE',
        transport: Transport.RMQ,
        options: {
          queue: configuration().RMQ_PRODUCER_QUEUE,
          urls: [configuration().RMQ_PRODUCER_URL],
          queueOptions: {
            durable: configuration().RMQ_PRODUCER_QUEUE_DURABLE,
          },
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
