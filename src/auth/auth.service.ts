import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '@prisma/__generated__';
import {Request, Response} from "express"
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    public constructor(private readonly userService: UserService, private readonly configService: ConfigService){}

    public async register(req: Request, dto: RegisterDto){
        const isExists = await this.userService.findByEmail(dto.email)

        if(isExists){
            throw new ConflictException('Registration failed. User with this email exists. Please, use another email or login')
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        return this.saveSession(req, newUser)
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)
        
        if(!user || !user.password){
            throw new NotFoundException(
                "User not found, please, check data"
            )
        } 

        const isValidPassword = await verify(user.password, dto.password)

        if(!isValidPassword){
            throw new UnauthorizedException("Incorrect password. Please, try again or recover password, if forgot it")
        }

        return this.saveSession(req, user)
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if(err){
                    return reject(
                        new InternalServerErrorException(
                            "Can`t destroy session, parhaps, there is a problem with server or session has already been destoyed ")
                    )
                }
                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
                resolve()
            })
        })
    }

    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if(err){
                    return reject(
                        new InternalServerErrorException(
                            "Не вдалось зберегти сесію. Перевірте, чи правильно налаштовані параметри сесії"
                        )
                    )
                }

                resolve({
                    user
                })
            })
        })
    }


}
