import { RegisterUserUseCase } from "./registerUser";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { User } from "../../../domain/entities/User";


const mockUserRepository = (): jest.Mocked<UserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateLastLogin: jest.fn(), 
});


describe("RegisterUserUseCase", () => {
    let userRepository: jest.Mocked<UserRepository>;
    let registerUserUseCase: RegisterUserUseCase;

    beforeEach(() => {
        userRepository = mockUserRepository();
        registerUserUseCase = new RegisterUserUseCase(userRepository);
    });

    it("should register a new user successfully", async () => {
        const input = {
        email: "test@example.com",
        name: "João Pedro",
        password: "StrongP@ssw0rd",
        phone: "11999999999",
        };

        // mock para salvar usuário (retornando id gerado)
        userRepository.save.mockResolvedValue("mocked-id");

        const output = await registerUserUseCase.execute(input);

        expect(output).toEqual({ id: "mocked-id" });
        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it("should throw an error if email is invalid", async () => {
        const input = {
        email: "invalid-email",
        name: "John Doe",
        password: "StrongP@ssw0rd",
        phone: "11999999999",
        };

        await expect(registerUserUseCase.execute(input)).rejects.toThrow(
        "Invalid E-mail"
        );

        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should throw an error if repository fails", async () => {
        const input = {
        email: "test@example.com",
        name: "John Doe",
        password: "StrongP@ssw0rd",
        phone: "11999999999",
        };

        // simula erro no repositório
        userRepository.save.mockRejectedValue(new Error("DB error"));

        await expect(registerUserUseCase.execute(input)).rejects.toThrow("DB error");
    });
});
