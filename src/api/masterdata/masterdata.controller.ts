import { Ireqbasicexecutebinding } from './dto/i-req-basic-execute-bing.dto';
import { Ireqbasicexecute } from './dto/i-req-basic-execute.dto';
import { MasterdataService } from './masterdata.service';
import { Controller, Get, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('master')
@ApiTags('Master')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class MasterdataController {

    constructor(private masterdataService: MasterdataService) { }

    @Get('/getmasterbranch')
    async getmasterbranch(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        return this.masterdataService.getmasterbranch(req, res, next)
    }

    @Get('/getmasterquotationstatus')
    async getmasterquotationstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        return this.masterdataService.getmasterquotationstatus(req, res, next)
    }

    @Get('/getmastertitle')
    async getmastertitle(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastertitle(req, res, next)
    }

    @Get('/getmasterrate')
    @ApiQuery({ name: 'pro_code', type: 'string', description: 'Pro code of Product', example: '01' })
    @ApiQuery({ name: 'size_model', type: 'string', description: 'ไซส์โมเดลที่ได้จาก getSizeModel', example: '03' })
    async getmasterrate(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterrate(req, res, next)
    }

    @Get('/getmasterterm')
    @ApiQuery({ name: 'pro_code', type: 'string', description: 'Pro code of Product', example: '01' })
    @ApiQuery({ name: 'size_model', type: 'string', description: 'ไซส์โมเดลที่ได้จาก getSizeModel', example: '03' })
    async getmasterterm(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterterm(req, res, next)
    }

    @Get('/getmasterimage')
    async getmasterimage(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterimage(req, res, next)
    }

    @Get('/getmasterdealer')
    @ApiQuery({ name: 'pro_code', type: 'string', description: 'Pro code of Product (รหัสสินค้า)', example: '01' })
    async getmasterdealer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterdealer(req, res, next)
    }

    @Get('/getmasterprovince')
    async getmasterprovince(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterprovince(req, res, next)
    }

    @Get('/getmastercarcheckstatus')
    async getmastercarcheckstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastercarcheckstatus(req, res, next)
    }

    @Get('/getmasterinsurance')
    @ApiQuery({ name: 'max_ltv', type: 'string', description: 'max_ltv of Product', example: '95000' })
    async getmasterinsurance(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterinsurance(req, res, next)
    }

    @Get('/getmasterinsurer')
    async getmasterinsurer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterinsurer(req, res, next)
    }

    @Get('/getmasterinsuranceyear')
    @ApiQuery({ name: 'insurer_code', type: 'string', description: 'รหัสบริษัทประกัน', example: '0001' })
    async getmasterinsuranceyear(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterinsuranceyear(req, res, next)
    }

    @Get('/getmastersizemodel')
    @ApiQuery({ name: 'pro_code', type: 'string', description: 'รหัสสินค้า', example: '01' })
    @ApiQuery({ name: 'brand_code', type: 'string', description: 'รุ่น', example: '02' })
    @ApiQuery({ name: 'model_code', type: 'string', description: 'โมเดล', example: '0002' })
    @ApiQuery({ name: 'dealer_code', type: 'string', description: 'รหัสร้านค้า', example: '20220001' })
    @ApiQuery({ name: 'busi_code', type: 'string', description: 'Business Code', example: '001' })
    @ApiQuery({ name: 'factory_price', type: 'number', description: 'ราคาโรงงาน', example: '163000' })
    async getmastersizemodel(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastersizemodel(req, res, next)
    }

    @Get('/getmasteroccupation')
    async getmasteroccupation(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasteroccupation(req, res, next)
    }

    @Get('/getmasternegostatus')
    async getmasternegostatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasternegostatus(req, res, next)
    }

    @Get('/getmastermariedstatus')
    async getmastermariedstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastermariedstatus(req, res, next)
    }

    @Get('/getmasterhousetype')
    async getmasterhousetype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterhousetype(req, res, next)
    }

    @Get('/getmasterhouseownertype')
    async getmasterhouseownertype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterhouseownertype(req, res, next)
    }

    @Get('/getmasterbrand')
    async getmasterbrand(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterbrand(req, res, next)
    }

    @Get('/getmastermodel')
    async getmastermodel(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastermodel(req, res, next)
    }

    @Get('getmastermodel_btw')
    async getmastermodel_btw(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmastermodel_btw(req, res, next)
    }

    @Post('/querybasicexecute')
    @ApiBody({ type: Ireqbasicexecute })
    async querybasicexecute(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.querybasicexecute(req, res, next)
    }

    @Post('/querybasicexecutebinding')
    @ApiBody({ type: Ireqbasicexecutebinding })
    async querybasicexecutebinding(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.querybasicexecutebinding(req, res, next)
    }

}
