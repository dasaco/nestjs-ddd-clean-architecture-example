import * as fs from 'node:fs'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { INestApplication } from '@nestjs/common'

import { getSwaggerAssetsAbsoluteFSPath } from '@nestjs/swagger/dist/swagger-ui/swagger-ui'
import { DateVO } from 'shared/domain/value-objects'
import { AppLogger } from 'shared/infrastructure/monitoring'

export class Swagger {
  private static app: INestApplication

  private readonly logger = new AppLogger(Swagger.name)

  constructor(app: INestApplication) {
    Swagger.app = app
  }

  public init() {
    this.logger.debug(
      'Initializing Swagger UI because SWAGGER_DOCS_ENABLED=true',
    )

    const options = new DocumentBuilder()
      .setTitle('Eshop API')
      .setDescription(
        `Eshop API updated at - ${DateVO.now().value.toUTCString()} UTC`,
      )
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(Swagger.app, options)
    const swaggerPath = '/swagger'

    this.deleteDefaultSwaggerHtml()

    SwaggerModule.setup(swaggerPath, Swagger.app, document, {
      useGlobalPrefix: true,
    })

    this.logger.debug(`Swagger UI successfully initialized at ${swaggerPath}`)
  }

  deleteDefaultSwaggerHtml() {
    const pathToDefaultHtml = `${getSwaggerAssetsAbsoluteFSPath()}/index.html`
    if (fs.existsSync(pathToDefaultHtml)) {
      fs.unlinkSync(pathToDefaultHtml)
    }
  }
}
