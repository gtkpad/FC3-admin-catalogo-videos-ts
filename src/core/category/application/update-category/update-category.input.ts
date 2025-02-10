import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
  validateSync,
} from "class-validator";

export type UpdateCategoryInputContructorProps = {
  id: string;

  name?: string;

  description?: string;

  is_active?: boolean;
};

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props?: UpdateCategoryInputContructorProps) {
    if (!props) return;
    this.id = props.id;
    props.name && (this.name = props.name);

    props.description && (this.description = props.name);

    props.is_active !== null &&
      props.is_active !== undefined &&
      (this.is_active = props.is_active);
  }
}

export class ValidateUpdateCategoryInput {
  static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
