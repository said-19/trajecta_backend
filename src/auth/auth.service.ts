import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { isProduction } from '../common/auth-cookie';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  get jwtSecret() {
    return this.resolveJwtSecret();
  }

  private resolveJwtSecret() {
    const secret = this.config.get<string>('JWT_SECRET')?.trim();
    if (isProduction()) {
      if (!secret || secret.length < 32) {
        throw new Error(
          'JWT_SECRET must be set to a random string of at least 32 characters in production.',
        );
      }
      return secret;
    }
    return secret || 'trajecta-dev-secret-change-me';
  }

  async onModuleInit() {
    this.resolveJwtSecret();

    const adminCount = await this.userModel.countDocuments({
      role: UserRole.ADMIN,
    });
    if (adminCount > 0) return;

    const email = (
      this.config.get<string>('ADMIN_EMAIL') ||
      (isProduction() ? '' : 'admin@trajecta.fr')
    )
      .trim()
      .toLowerCase();
    const password =
      this.config.get<string>('ADMIN_PASSWORD') ||
      (isProduction() ? '' : 'Trajecta2026!');

    if (!email || !password) {
      throw new Error(
        'No admin user found. Set ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the first administrator.',
      );
    }

    if (isProduction() && password.length < 12) {
      throw new Error(
        'ADMIN_PASSWORD must be at least 12 characters in production.',
      );
    }

    await this.userModel.create({
      firstName: 'Admin',
      lastName: 'Trajecta',
      email,
      password: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
      isActive: true,
    });
    this.logger.log(`Admin account created for ${email}`);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Accès réservé à l’administration');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const token = jwt.sign(
      {
        sub: String(user._id),
        email: user.email,
        role: user.role,
      } satisfies JwtPayload,
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return {
      token,
      user: {
        id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async me(token?: string) {
    if (!token) {
      throw new UnauthorizedException('Non authentifié');
    }
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      const user = await this.userModel.findById(payload.sub).lean().exec();
      if (!user || !user.isActive || user.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('Non authentifié');
      }
      return {
        id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Session expirée ou invalide');
    }
  }
}
