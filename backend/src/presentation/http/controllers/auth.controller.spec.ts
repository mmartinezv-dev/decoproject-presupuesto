import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthApplicationService } from '../../../application/auth/auth.application-service';

const mockAuthService = {
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
};

function mockResponse() {
  return { cookie: jest.fn(), clearCookie: jest.fn() } as any;
}

function mockRequest(cookie?: string) {
  return { cookies: cookie ? { refresh_token: cookie } : {} } as any;
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthApplicationService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should set cookie and return accessToken', async () => {
      mockAuthService.login.mockResolvedValueOnce({
        accessToken: 'access.token',
        refreshToken: 'refresh.token',
      });
      const res = mockResponse();
      const result = await controller.login({ username: 'admin', password: 'admin123' } as any, res);
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh.token', expect.any(Object));
      expect(result).toEqual({ accessToken: 'access.token' });
    });
  });

  describe('refresh', () => {
    it('should throw if no cookie', async () => {
      await expect(controller.refresh(mockRequest(), mockResponse())).rejects.toThrow(UnauthorizedException);
    });

    it('should rotate cookie and return new accessToken', async () => {
      mockAuthService.refresh.mockResolvedValueOnce({
        accessToken: 'new.access',
        refreshToken: 'new.refresh',
      });
      const res = mockResponse();
      const result = await controller.refresh(mockRequest('old.refresh'), res);
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'new.refresh', expect.any(Object));
      expect(result).toEqual({ accessToken: 'new.access' });
    });
  });

  describe('logout', () => {
    it('should clear cookie', async () => {
      mockAuthService.logout.mockResolvedValueOnce(undefined);
      const res = mockResponse();
      const result = await controller.logout(mockRequest('some.token'), res);
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', expect.any(Object));
      expect(result).toEqual({ ok: true });
    });
  });
});
