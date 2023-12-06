import { Ireqbasicexecutebinding } from './dto/i-req-basic-execute-bing.dto';
import { Ireqbasicexecute } from './dto/i-req-basic-execute.dto';
import { MasterdataService } from './masterdata.service';
import { Controller, Get, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqGetMasterdealergrade } from './dto/p-req-getmasterdealergrade.dto';
import { PReqGetmaxltv } from './dto/p-req-getmaxltv.dto';
import { PReqGetcoveragetotalloss } from './dto/p-req-getcoveragetotalloss.dto';
import { PReqGetmasterterm } from './dto/p-req-getmasterterm.dto';
import { PReqGetpaymentvalue } from './dto/p-req-getpaymentvalue.dto';
import { PReqMplsCalculateMotoYear } from './dto/p-req-mpls_calculate_moto_year';
import { PReqGetmasterrate } from './dto/p-req-getmasterrate';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';

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
    /*
    @ApiQuery({ name: `size_model`, type: `string`, description: `ไซส์โมเดลที่ได้จาก getSizeModel`, example: `03` })
    @ApiQuery({ name: `pro_code`, type: `string`, description: `Pro code of Product'`, example: `01` })
    @ApiQuery({ name: `bussiness_code`, type: `string`, description: `รถจักรยานยนต์ : '001' , รถมือสอง MPLUS : '002'`, example: `03` })
    */
    @ApiQuery({
        type: PReqGetmasterrate
    })
    async getmasterrate(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterrate(req, res, next)
    }

    @Get('/getmasterterm')
    /*
    @ApiQuery({ name: `pro_code`, type: `string`, description: `Pro code of Product`, example: `01` })
    @ApiQuery({ name: `size_model`, type: `string`, description: `ไซส์โมเดลที่ได้จาก getSizeModel`, example: `03` })
    @ApiQuery({ name: `rate`, type: `number`, description: `Size Model (get value from getmastersizemodel)`, example: 1.12 })
    @ApiQuery({ name: `net_finance`, type: `number`, description: `ยอดกู้รวมเบี้ยประกัน (ถ้ามี)`, example: 60000 })
    @ApiQuery({ name: `bussiness_code`, type: `string`, description: `รถจักรยานยนต์ : '001' , รถมือสอง MPLUS : '002'`, example: `001` })
    */
    @ApiQuery({
        type: PReqGetmasterterm
    })
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

    @ApiQuery({
        type: PReqGetMasterdealergrade
    })
    @Get('/getmasterdealergrade')
    async getmasterdealergrade(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterdealergrade(req, res, next)
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
    @ApiQuery({ name: 'moto_year', type: 'number', description: 'อายุ', example: 1 })
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

    @Get('/getmasterfueltype')
    async getmasterfueltype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterfueltype(req, res, next)
    }

    @Get('/getmaxltv')
    @ApiQuery({ type: PReqGetmaxltv })
    async getmaxltv(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmaxltv(req, res, next)
    }

    @Get('/getcoveragetotalloss')
    @ApiQuery({ type: PReqGetcoveragetotalloss })
    async getcoveragetotalloss(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getcoveragetotalloss(req, res, next)
    }

    @ApiQuery({
        type: PReqGetpaymentvalue
    })
    @Get('/getpaymentvalue')
    async getpaymentvalue(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getpaymentvalue(req, res, next)
    }

    /* ... prduct-detail page 

    getMasterBussiness => getmasterbusiness
    getDealer => getmasterdealer
    MPLS_getbrand => getmasterbrand
    MPLS_getmodel => getmastermodel
    getMasterProvince =< getmasterprovince
    getFuelType => getmasterfueltype
    getDealergrade => getmasterdealergrade
    getMaxLtv => getmaxltv
    getInsurance => getmasterinsurance
    getSizeModel => getmastersizemodel
    getMasterRate => getmasterrate'
    getTermNew => getmasterterm
    getPaymentValue => getpaymentvalue
    getcoverageTotalloss 
    MPLS_calculate_moto_year
    ... */
    @Get('/getmasterbussiness')
    async getmasterbussiness(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmasterbussiness(req, res, next)
    }

    @ApiBody({
        type: PReqMplsCalculateMotoYear
    })
    @Post('/MPLS_calculate_moto_year')
    async MPLS_calculate_moto_year(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.MPLS_calculate_moto_year(req, res, next)
    }

    /* ... 
    career and purpose 
    getOccupation => getmasteroccupation (on above)
    ... */

    /* ... image-attach page
    getImageTypeAttach => getimagetypeattach
    getImageTypeAttachMultiple => getimagetypeattachmultiple
    ... */

    @Get('/getimagetypeattach')
    async getimagetypeattach(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getimagetypeattach(req, user, res, next)
    }

    @Get('/getimagetypeattachmultiple')
    async getimagetypeattachmultiple(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getimagetypeattachmultiple(req, user, res, next)
    }

    /* ... mrta ... */

    /* ... this move from mrtaService to masterdataService ... */
    @Get('/getmrtaseller')
    async getmrtaseller(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.masterdataService.getmrtaseller(req, user, res, next)
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
