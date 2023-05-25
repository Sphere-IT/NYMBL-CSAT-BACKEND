import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const Allow = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
