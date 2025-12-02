import request from "supertest";
import app from "../../app";
import { prisma } from "../../infra/db/prisma";

describe("Listing - Create", () => {
    let userId: string;
    let roleId: string;

    beforeAll(async () => {
        await prisma.$connect();
        
        // Criar usuário via rota de registro
        const registerResponse = await request(app)
            .post("/auth/user/register")
            .send({
                name: "Teste Listing",
                email: `teste-${Date.now()}@example.com`,
                password: ".Jplc1203"
            });

        expect(registerResponse.status).toBe(201);
        userId = registerResponse.body.id;
    });

    afterAll(async () => {
        await prisma.$transaction([
            prisma.media.deleteMany(),
            prisma.propertyDetail.deleteMany(),
            prisma.listing.deleteMany(),
            prisma.address.deleteMany(),
            prisma.profilePicture.deleteMany(),
            prisma.refreshToken.deleteMany(),
            prisma.user.deleteMany(),
            prisma.role.deleteMany(),
        ]);

    });

    it("deve criar um listing", async () => {
        const payload = {
            title: "Casa teste",
            description: "Descrição fake",
            type: "CASA",
            category: "RESIDENTIAL",
            basePrice: 1500,
            iptu: 120,
            userId,
            address: {
                zipCode: "12345678",
                state: "SP",
                city: "São Paulo",
                neighborhood: "Centro",
                street: "Rua X",
                reference: "Perto do Y"
            },
            details: {
                area: 80,
                bedrooms: 2,
                bathrooms: 1,
                doesntPayWaterBill: false,
                hasGarage: true,
                isPetFriendly: true,
                hasCeramicFlooring: true,
                hasCeilingLining: false,
                hasBackyard: true,
                hasPool: false,
                hasSolarPanel: false,
                hasParkingLot: false,
                isAccessible: false,
                hasAirConditioner: true,
                hasChildArea: false,
                hasKitchen: true,
                hasWarehouse: false,
            }
        };

        const response = await request(app)
            .post("/listing/register")
            .send(payload);

        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it("Deve buscar um listing por id", async () => {
        const createPayload = {
            title: "Apartamento teste",
            description: "Descrição fake",
            type: "APARTAMENTO",
            category: "RESIDENTIAL",
            basePrice: 2000,
            iptu: 150,
            userId,
            address: {
                zipCode: "87654321",
                state: "RJ",
                city: "Rio de Janeiro",
                neighborhood: "Copacabana",
                street: "Avenida Y",
                reference: "Perto do Z"
            },
            details: {
                area: 60,
                bedrooms: 1,
                bathrooms: 1,
                hasGarage: false,
                isPetFriendly: false,
                hasCeramicFlooring: true,
                hasCeilingLining: true,
                hasBackyard: false,
                hasPool: true,
                hasSolarPanel: true,
                hasParkingLot: false,
                isAccessible: true,
                hasAirConditioner: false,
                hasChildArea: false,
                hasKitchen: true,
                hasWarehouse: false
            }
        };

        const createResponse = await request(app)
            .post("/listing/register")
            .send(createPayload);

        expect(createResponse.status).toBe(201);
        const id = createResponse.body.id;

        const response = await request(app)
            .get(`/listing/find/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
        expect(response.body.title).toBe(createPayload.title);
        expect(response.body.type).toBe(createPayload.type);
        expect(response.body.category).toBe(createPayload.category);
        expect(response.body.userId).toBe(userId);

        expect(response.body.address).toMatchObject({
            zipCode: "87654321",
            state: "RJ",
            city: "Rio de Janeiro",
            neighborhood: "Copacabana",
            street: "Avenida Y",
            reference: "Perto do Z",
        });

        expect(response.body.details).toMatchObject({
            area: 60,
            bedrooms: 1,
            bathrooms: 1,
            hasGarage: false,
            isPetFriendly: false,
            hasCeramicFlooring: true,
            hasBackyard: false,
            hasPool: true,
            hasSolarPanel: true,
            isAccessible: true,
            hasKitchen: true,
        });
    });

    it("deve retornar 404 ao buscar listing inexistente", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .get(`/listing/find/${fakeId}`);

        expect(response.status).toBe(404);
    });

    it("deve deletar um listing", async () => {
        const payload = {
            title: "Casa para deletar",
            description: "Descrição fake",
            type: "CASA",
            category: "RESIDENTIAL",
            basePrice: 1500,
            userId,
            address: {
                zipCode: "12345678",
                state: "SP",
                city: "São Paulo",
                neighborhood: "Centro",
                street: "Rua X",
                reference: "Perto do Y"
            },
            details: {
                area: 80,
                bedrooms: 2,
                bathrooms: 1,
                hasGarage: true,
                isPetFriendly: true,
                hasCeramicFlooring: true,
                hasCeilingLining: false,
                hasBackyard: true,
                hasPool: false,
            }
        };

        const createResponse = await request(app)
            .post("/listing/register")
            .send(payload);

        expect(createResponse.status).toBe(201);
        const id = createResponse.body.id;

        const deleteResponse = await request(app)
            .delete(`/listing/${id}`);

        expect(deleteResponse.status).toBe(200);
    });
});

describe("Listar todos os listings", () => {
    jest.setTimeout(20000);
    let userId: string;

    beforeAll(async () => {
        await prisma.$connect();

        await prisma.media.deleteMany();
        await prisma.propertyDetail.deleteMany();
        await prisma.listing.deleteMany();
        await prisma.address.deleteMany();
        await prisma.profilePicture.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();
        await prisma.role.deleteMany();


        // Criar usuário via rota de registro
        const registerResponse = await request(app)
            .post("/auth/user/register")
            .send({
                name: "Teste Search",
                email: `teste-search-${Date.now()}@example.com`,
                password: ".Jplc1203"
            });

        expect(registerResponse.status).toBe(201);
        userId = registerResponse.body.id;

        // Criar listings com o userId criado

        await request(app)
            .post("/listing/register")
            .send({
            title: "Casa teste",
            description: "Descrição fake",
            type: "CASA",
            category: "RESIDENTIAL",
            basePrice: 1500,
            iptu: 120,
            userId,
            address: {
                zipCode: "12345678",
                state: "SP",
                city: "São Paulo",
                neighborhood: "Centro",
                street: "Rua X",
                reference: "Perto do Y"
            },
            details: {
                area: 80,
                bedrooms: 2,
                bathrooms: 1,
                doesntPayWaterBill: false,
                hasGarage: true,
                isPetFriendly: true,
                hasCeramicFlooring: true,
                hasCeilingLining: false,
                hasBackyard: true,
                hasPool: false,
                hasSolarPanel: false,
                hasParkingLot: false,
                isAccessible: false,
                hasAirConditioner: true,
                hasChildArea: false,
                hasKitchen: true,
                hasWarehouse: false,
            }
        });

        await request(app)
            .post("/listing/register")
            .send({
            title: "Casa teste2",
            description: "Descrição fake",
            type: "CASA",
            category: "RESIDENTIAL",
            basePrice: 1500,
            iptu: 120,
            userId,
            address: {
                zipCode: "12345678",
                state: "SP",
                city: "São Paulo",
                neighborhood: "Centro",
                street: "Rua X",
                reference: "Perto do Y"
            },
            details: {
                area: 80,
                bedrooms: 2,
                bathrooms: 1,
                doesntPayWaterBill: false,
                hasGarage: true,
                isPetFriendly: true,
                hasCeramicFlooring: true,
                hasCeilingLining: false,
                hasBackyard: true,
                hasPool: false,
                hasSolarPanel: false,
                hasParkingLot: false,
                isAccessible: false,
                hasAirConditioner: true,
                hasChildArea: false,
                hasKitchen: true,
                hasWarehouse: false,
            }
        });
    });

    afterAll(async () => {
        await prisma.$transaction([
            prisma.media.deleteMany(),
            prisma.propertyDetail.deleteMany(),
            prisma.listing.deleteMany(),
            prisma.address.deleteMany(),
            prisma.profilePicture.deleteMany(),
            prisma.refreshToken.deleteMany(),
            prisma.user.deleteMany(),
            prisma.role.deleteMany(),
        ]);
    });

    it("deve listar todos os listings", async () => {
        const res = await request(app)
            .get("/listing/all");

        console.log("STATUS:", res.status);
        console.log("BODY:", res.body);


        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.allListings).toBeDefined();
        expect(Array.isArray(res.body.allListings)).toBe(true);
        expect(res.body.allListings.length).toBeGreaterThanOrEqual(2);

        for (const item of res.body.allListings) {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("title");
            expect(item).toHaveProperty("type");
            expect(item).toHaveProperty("category");
            expect(item).toHaveProperty("basePrice");
            expect(item).toHaveProperty("userId");
        }
    });

});