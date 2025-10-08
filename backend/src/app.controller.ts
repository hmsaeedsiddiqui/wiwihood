import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns application health status and basic info' 
  })
  getHello(): object {
    return this.appService.getHealthStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns detailed application health information' 
  })
  getHealth(): object {
    return this.appService.getHealthStatus();
  }
}
