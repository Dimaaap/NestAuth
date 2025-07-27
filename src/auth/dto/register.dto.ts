import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Validate
} from "class-validator";

import { IsPasswordMatchingConstraint } from "@/libs/decorators/is-password-matching-constraint.decorator";

export class RegisterDto {
    @IsString({ message: "Name should be string" })
    @IsNotEmpty({ message: "Name is required" })
    name: string

    @IsString({ message: "Email should be string" })
    @IsEmail({}, { message: "Incorrect email" })
    @IsNotEmpty({ message: "Email is required" })
    email: string

    @IsString({ message: "Password should be string" })
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, {
        message: "Password should contain at least 6 chars"
    })
    password: string

    @IsString({ message: "Password repeat should be string" })
    @IsNotEmpty({ message: "Password repeat is required" })
    @MinLength(6, {
        message: "Password repeat should contain at least 6 chars"
    })
    @Validate(IsPasswordMatchingConstraint, {
        message: "Passwords are not matching"
    })
    passwordRepeat: string

}