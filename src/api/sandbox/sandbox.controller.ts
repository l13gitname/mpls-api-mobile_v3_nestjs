import { Controller, Get, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SandboxService } from './sandbox.service';
import { PReqTestmoment } from './dto/p-req-testmoment';

@Controller('Sandbox')
@ApiTags('Sandbox')

export class SandboxController {

    constructor(private sandboxService: SandboxService) { }

    @ApiBody({
        type: PReqTestmoment
    })
    @Post('/testmoment')
    async testmoment(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        return this.sandboxService.testmoment(req, res, next)
    }

}
