import { INestApplication, ValidationPipe } from '@nestjs/common'
import getConfig from 'shared/infrastructure/configs/config'

export function configure(app: INestApplication) {
  const configs = getConfig()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.setGlobalPrefix(configs.basePath)

  app.enableCors()
  app.enableShutdownHooks()
}
