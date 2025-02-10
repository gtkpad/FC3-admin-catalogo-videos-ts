import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
  validateSync,
} from "class-validator";

export type CreateCategoryInputContructorProps = {
  name: string;

  description?: string;

  is_active?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props?: CreateCategoryInputContructorProps) {
    if (!props) return;
    Object.assign(this, props);
  }
}

export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}
