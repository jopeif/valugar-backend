import { LoginUseCase } from "./login";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import { User } from "../../../domain/entities/User";
import jwt from "jsonwebtoken";
import { config } from "../../../infra/config/config";

// Mock do jwt
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

// Mock helpers
const mockUserRepository = (): jest.Mocked<UserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateLastLogin: jest.fn(),
});

const mockRefreshTokenRepository = (): jest.Mocked<RefreshTokenRepository> => ({
    save: jest.fn(),
    findByToken: jest.fn(),
    findByUserId: jest.fn(),
    deleteByToken: jest.fn(),
    deleteAllFromUser: jest.fn(),
});

describe("LoginUseCase", () => {
    let userRepository: jest.Mocked<UserRepository>;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
    let loginUseCase: LoginUseCase;

    beforeEach(() => {
        userRepository = mockUserRepository();
        refreshTokenRepository = mockRefreshTokenRepository();
        loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository);

        jest.clearAllMocks();

        // Definindo secrets fake
        process.env.ACCESS_TOKEN_SECRET = "secret_access";
        process.env.REFRESH_TOKEN_SECRET = "secret_refresh";
    });

    it("should login successfully and return tokens", async () => {
        const fakeUser = await User.assemble({
        id: "user-1",
        email: "valid@example.com",
        name: "Test User",
        password: "hashedPassword",
        role: "user",
        createdAt: new Date(),
        isBlocked: false,
        });

        userRepository.findByEmail.mockResolvedValue(fakeUser);
        (jwt.sign as jest.Mock)
        .mockReturnValueOnce("fakeAccessToken")
        .mockReturnValueOnce("fakeRefreshToken");

        const result = await loginUseCase.execute({
        email: "valid@example.com",
        password: "StrongP@ssw0rd",
        });

        expect(userRepository.findByEmail).toHaveBeenCalledWith("valid@example.com");
        expect(refreshTokenRepository.deleteAllFromUser).toHaveBeenCalledWith("user-1");
        expect(refreshTokenRepository.save).toHaveBeenCalledWith(
        "user-1",
        "fakeRefreshToken",
        expect.any(Date)
        );
        expect(userRepository.updateLastLogin).toHaveBeenCalledWith("user-1", expect.any(Date));
        expect(result).toEqual({
        accessToken: "fakeAccessToken",
        refreshToken: "fakeRefreshToken",
        });
    });

    it("should throw if user does not exist", async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(
        loginUseCase.execute({ email: "invalid@example.com", password: "test" })
        ).rejects.toThrow("Invalid credentials");

        expect(refreshTokenRepository.deleteAllFromUser).not.toHaveBeenCalled();
    });

    it("should throw if user is blocked", async () => {
        const blockedUser = await User.assemble({
        id: "user-2",
        email: "blocked@example.com",
        name: "Blocked User",
        password: "hashedPassword",
        role: "user",
        createdAt: new Date(),
        isBlocked: true,
        });

        userRepository.findByEmail.mockResolvedValue(blockedUser);

        await expect(
        loginUseCase.execute({ email: "blocked@example.com", password: "test" })
        ).rejects.toThrow("Invalid credentials");

        expect(refreshTokenRepository.deleteAllFromUser).not.toHaveBeenCalled();
    });
});
