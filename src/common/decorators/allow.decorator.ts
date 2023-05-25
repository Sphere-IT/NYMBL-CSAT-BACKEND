import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const Allow = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
