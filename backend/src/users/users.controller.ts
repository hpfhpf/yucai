import {
  Body, Controller, Get, HttpCode, Post, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMe(user.sub);
  }

  @Put('me')
  @ApiOperation({ summary: '更新昵称' })
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.sub, dto);
  }

  @Post('me/avatar')
  @HttpCode(501)
  @ApiOperation({ summary: '上传头像（待接入腾讯云 COS）' })
  uploadAvatar() {
    return { message: '头像上传功能待接入腾讯云 COS，敬请期待', code: 501 };
  }
}
