import { IsArray, IsString } from 'class-validator';

export class ReorderFormationsDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
