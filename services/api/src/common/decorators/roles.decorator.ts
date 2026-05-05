import { SetMetadata } from '@nestjs/common';

export const METADATA_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(METADATA_KEY, roles);
