import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { UsersService } from './users.service';

import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CurrentUser } from 'src/models/current.users';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('registration')
  async registerUser(@Body() reg: RegistrationReqModel) {
    return await this.userService.registerUser(reg);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.userService.getJwtToken(req.user as CurrentUser);

    const refreshToken = await this.userService.getRefreshToken(
      req.user.userId,
    );

    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'success' };
  }

  //   shorten-url endpoint
  @Get('shorten-url')
  @UseGuards(AuthGuard('jwt'))
  async movies(@Req() req) {
    return ['Hello World'];
  }

  // endpont to get the refresh token
  @Get('refresh-tokens')
  @UseGuards(AuthGuard('refresh'))
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.userService.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.userService.getRefreshToken(
      req.user.userId,
    );
    const secretData = {
      token,
      refreshToken,
    };

    // res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'success' };
  }
}
