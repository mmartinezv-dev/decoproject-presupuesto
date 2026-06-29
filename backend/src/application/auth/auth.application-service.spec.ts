import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthApplicationService } from './auth.application-service';
import { RefreshTokenStore } from '../../infrastructure/auth/refresh-token.store';

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockTokenStore = {
  issue: jest.fn(),
  rotate: jest.fn(),
  revoke: jest.fn(),
};

describe('AuthApplicationService', () => {
  let service: AuthApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthApplicationService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: RefreshTokenStore, useValue: mockTokenStore },
      ],
    }).compile();

    service = module.get<AuthApplicationService>(AuthApplicationService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw UnauthorizedException for wrong credentials', async () => {
      await expect(service.login('wrong', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('should return accessToken and refreshToken on valid credentials', async () => {
      mockTokenStore.issue.mockResolvedValueOnce('some-jti');
      mockJwtService.sign
        .mockReturnValueOnce('access.token')
        .mockReturnValueOnce('refresh.token');

      const result = await service.login('admin', 'decoproject2024');

      expect(result.accessToken).toBe('access.token');
      expect(result.refreshToken).toBe('refresh.token');
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementationOnce(() => { throw new Error('invalid'); });
      await expect(service.refresh('bad.token')).rejects.toThrow(UnauthorizedException);
    });

    it('should rotate token and return new tokens', async () => {
      mockJwtService.verify.mockReturnValueOnce({ sub: 'admin', jti: 'old-jti' });
      mockTokenStore.rotate.mockResolvedValueOnce('new-jti');
      mockJwtService.sign
        .mockReturnValueOnce('new.access.token')
        .mockReturnValueOnce('new.refresh.token');

      const result = await service.refresh('valid.refresh.token');

      expect(result.accessToken).toBe('new.access.token');
      expect(result.refreshToken).toBe('new.refresh.token');
      expect(mockTokenStore.rotate).toHaveBeenCalledWith('old-jti', expect.any(Number));
    });
  });

  describe('logout', () => {
    it('should revoke token on logout', async () => {
      mockJwtService.verify.mockReturnValueOnce({ jti: 'some-jti' });
      await service.logout('valid.refresh.token');
      expect(mockTokenStore.revoke).toHaveBeenCalledWith('some-jti');
    });

    it('should not throw if token is invalid on logout', async () => {
      mockJwtService.verify.mockImplementationOnce(() => { throw new Error('invalid'); });
      await expect(service.logout('bad.token')).resolves.not.toThrow();
    });
  });
});
