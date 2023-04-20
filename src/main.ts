import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalConstants } from "../src/common/constants/global";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

((): void => {
  bootstrap()
    .then(() => process.stdout.write(`Listening on port ${GlobalConstants.PORT}...\n`))
    .catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    });
})();
