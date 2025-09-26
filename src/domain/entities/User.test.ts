import { User, UserProps } from "./User";

describe("User Entity", () => {
    it("should create a valid user", async () => {
        const user = await User.build(
        "testedeemail@example.com",
        "João Pedro",
        "StrongP@ssw0rd",
        "user",
        "11999999999"
        );

        expect(user).toBeInstanceOf(User);
        const props = user.getProps();
        expect(props.email).toBe("testedeemail@example.com");
        expect(props.name).toBe("João Pedro");
        expect(props.role).toBe("user");
        expect(props.isBlocked).toBe(false);
    });

    it("should throw if email is invalid", async () => {
        await expect(
        User.build("invalid-email", "John Doe", "StrongP@ssw0rd", "user")
        ).rejects.toThrow("Invalid E-mail");
    });

    it("should throw if name is empty", async () => {
        await expect(
        User.build("valid@example.com", "   ", "StrongP@ssw0rd", "user")
        ).rejects.toThrow("Name cannot be empty");
    });

    it("should throw if password is too short", async () => {
        await expect(
        User.build("valid@example.com", "John Doe", "Short1!", "user")
        ).rejects.toThrow("Password must be at least 8 characters long");
    });

    it("should throw if password has no uppercase", async () => {
        await expect(
        User.build("valid@example.com", "John Doe", "weakp@ss1", "user")
        ).rejects.toThrow("Password must contain at least one uppercase letter");
    });

    it("should throw if password has no lowercase", async () => {
        await expect(
        User.build("valid@example.com", "John Doe", "WEAKP@SS1", "user")
        ).rejects.toThrow("Password must contain at least one lowercase letter");
    });

    it("should throw if password has no number", async () => {
        await expect(
        User.build("valid@example.com", "John Doe", "WeakP@ss", "user")
        ).rejects.toThrow("Password must contain at least one number");
    });

    it("should throw if password has no special character", async () => {
        await expect(
        User.build("valid@example.com", "John Doe", "WeakPass1", "user")
        ).rejects.toThrow("Password must contain at least one special character");
    });

    it("should throw if phone is invalid", async () => {
        await expect(
        User.build(
            "valid@example.com",
            "John Doe",
            "StrongP@ss1",
            "user",
            "12345"
        )
        ).rejects.toThrow("Telefone inválido");
    });

    it("should assemble a user from props", async () => {
        const props: UserProps = {
        id: "123",
        email: "assemble@example.com",
        name: "Assemble Test",
        password: "hashed_password",
        role: "admin",
        createdAt: new Date(),
        isBlocked: false,
        };

        const user = await User.assemble(props);

        expect(user).toBeInstanceOf(User);
        expect(user.getProps()).toEqual(props);
    });

    it("should toggle isBlocked", async () => {
        const user = await User.build(
        "toggle@example.com",
        "Toggle User",
        "StrongP@ss1",
        "user"
        );

        const propsBefore = user.getProps();
        expect(propsBefore.isBlocked).toBe(false);

        user.toggleIsBlocked();
        expect(user.getProps().isBlocked).toBe(true);

        user.toggleIsBlocked();
        expect(user.getProps().isBlocked).toBe(false);
    });
});
