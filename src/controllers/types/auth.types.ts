import { Request } from 'express';

export interface RegisterRequest extends Request {
  body: {
    login: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    login: string;
    password: string;
  };
}

export interface RefreshTokenRequest extends Request {
  body: {
    refreshToken: string;
  };
}
