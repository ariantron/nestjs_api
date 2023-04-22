import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RMQ_MODULE') private readonly client: ClientProxy) {}

  public async sendAccountCreationEvent(
    pattern: string,
    email: string,
    data: any,
  ) {
    await this.client
      .emit(pattern, data)
      .toPromise()
      .then(() => {
        console.log(
          `Send account creation event for user <${email}> has succeed!`,
        );
      })
      .catch((error) => {
        console.log(
          `Send account creation event for user <${email}> has failed! [${JSON.stringify(
            error,
          )}]`,
        );
      });
  }
}
