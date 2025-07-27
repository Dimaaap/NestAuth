import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsString({message: "Email should be string"})
    @IsEmail({}, {message: "Invalid email"})
    @IsNotEmpty({message: "Email is required"})
    email: string 

    @IsString({message: "Password shoud be string"})
    @IsNotEmpty({message: "Password is requried"})
    @MinLength(6, {message: "Password should be at least 6 chars length"})
    password: string
}