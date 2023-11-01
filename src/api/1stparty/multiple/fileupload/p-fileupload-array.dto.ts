import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadDtoMultiple {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    image_file: any[];
  }
  
// import { ApiProperty } from "@nestjs/swagger";

// export class FilesUploadDtoMultiple {
//   @ApiProperty({ type: 'string', format: 'binary' })
//   image_file: any;
// }