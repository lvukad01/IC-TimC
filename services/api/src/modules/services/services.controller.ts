import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('salon/:salonid/category/:categoryid')
@ApiBearerAuth()
@Controller()
export class ServicesController{
  
    @Get()
    @ApiOperation({})
}