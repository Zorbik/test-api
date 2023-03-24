import { IsString, ArrayNotEmpty, ArrayMinSize, IsIn } from "class-validator";

export class CreateTestDto {
  @IsIn(["theory", "technical"])
  category: "theory" | "technical";

  @IsString()
  question: string;

  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @IsString({ each: true })
  answers: string[];

  @IsString()
  rightAnswer: string;
}
