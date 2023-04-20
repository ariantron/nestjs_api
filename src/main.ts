import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configuration().PORT);
}

((): void => {
  bootstrap()
    .then(() =>
      process.stdout.write(`Listening on port ${configuration().PORT}...\n`),
    )
    .catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    });
})();
