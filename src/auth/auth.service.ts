import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import * as bcrypt from 'bcrypt';
  import { UserService } from '../user/user.service';
  import { LoginDto } from './dto';
  import { AuthResponseDto } from './dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly usersService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
      const { email, password, rememberMe } = loginDto;
  
      // Find user by email
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }
  
      // Generate tokens
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      
      let refreshToken: string | undefined;
      if (rememberMe) {
        refreshToken = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d', // Long-lived refresh token
        });
  
        await this.usersService.updateRefreshToken(user.id, refreshToken);
      }
  
      // Update last login
      await this.usersService.updateLastLogin(user.id);
  
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }
  
    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
  
        const user = await this.usersService.findById(payload.sub);
        if (!user || user.refreshToken !== refreshToken) {
          throw new UnauthorizedException('Invalid refresh token');
        }
  
        const newPayload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(newPayload);
  
        return { accessToken };
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  
    async logout(userId: string): Promise<void> {
      await this.usersService.updateRefreshToken(userId, null);
    }
  
    async validateUser(userId: string): Promise<Omit<any, 'password' | 'refreshToken'> | null> {
      const user = await this.usersService.findById(userId);
      if (!user || !user.isActive) {
        return null;
      }
      const { password, refreshToken, ...result } = user;
      return result;
    }
  }