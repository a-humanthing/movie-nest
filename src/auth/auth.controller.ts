import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    Res,
    Get,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto';
  import { AuthResponseDto } from './dto';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) response: Response,
    ): Promise<AuthResponseDto> {
      const result = await this.authService.login(loginDto);
  
      // Set refresh token as httpOnly cookie if remember me is enabled
      if (result.refreshToken) {
        response.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }
  
      // Don't return refresh token in response body for security
      const { refreshToken, ...responseData } = result;
      return responseData as AuthResponseDto;
    }
  
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'New access token generated' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Req() request: Request): Promise<{ accessToken: string }> {
      const refreshToken = request.cookies?.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
  
      return this.authService.refreshToken(refreshToken);
    }
  
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    async logout(
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response,
    ): Promise<{ message: string }> {
      const user = request.user as any;
      await this.authService.logout(user.id);
  
      // Clear refresh token cookie
      response.clearCookie('refreshToken');
  
      return { message: 'Successfully logged out' };
    }
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile data' })
    async getProfile(@Req() request: Request) {
      return request.user;
    }
  }