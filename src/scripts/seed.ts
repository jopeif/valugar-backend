import 'dotenv/config';
import { RegisterUserUseCase } from '../application/usecase/auth/registerUser';
import { LoginUseCase } from '../application/usecase/auth/login';
import { CreateListingUseCase } from '../application/usecase/listing/createListing';
import { UserRepositoryPrisma } from '../infra/db/concrete.prisma/userRepository.prisma';
import { RefreshTokenRepositoryPrisma } from '../infra/db/concrete.prisma/refreshTokenRepository.prisma';
import { ListingRepositoryPrisma } from '../infra/db/concrete.prisma/listingRepository.prisma';
import { NodemailerMailProvider } from '../infra/web/providers/nodemailerMailProvider';
import { createListingDTOInput } from '../application/dto/listing/CreateListingDTO';
import { prisma } from '../infra/db/prisma';

(async () => {
  const mailProvider = new NodemailerMailProvider();
  const userRepo = new UserRepositoryPrisma();
  const refreshTokenRepo = new RefreshTokenRepositoryPrisma();
  const listingRepo = new ListingRepositoryPrisma();

  const registerUser = new RegisterUserUseCase(userRepo, mailProvider);
  const loginUser = new LoginUseCase(userRepo, refreshTokenRepo, mailProvider);
  const createListing = new CreateListingUseCase(listingRepo);

  try {

    console.log('Apagando dados atuais...')
    await prisma.listing.deleteMany()
    await prisma.user.deleteMany()
    await prisma.refreshToken.deleteMany()

    console.log('👤 Criando usuários de teste...');
    const users = [
      { name: 'João Silva', email: 'joaopedrodelimacarlos@gmail.com', password: '.Jplc1203', phone: '88999999999' },
      { name: 'Maria Souza', email: 'maria@test12345667.com', password: '.Jplc1203', phone: '88988888888' },
    ];

    const userIds: string[] = [];

    for (const user of users) {
      const result = await registerUser.execute(user);
      console.log(`Usuário criado: ${user.email}`);
      userIds.push(result.id);
    }

    console.log('🔑 Fazendo login para gerar tokens...');
    for (const user of users) {
      const { accessToken } = await loginUser.execute({ email: user.email, password: user.password });
      console.log(`Token de ${user.email}: ${accessToken.substring(0, 20)}...`);
    }

    console.log('🏠 Criando listings...');
    const listings: createListingDTOInput[] = [];

const cities = [
  { city: 'Limoeiro do Norte', neighborhood: 'Centro', street: 'Rua das Flores, 123' },
  { city: 'Russas', neighborhood: 'Jardim das Acácias', street: 'Av. Principal, 456' },
  { city: 'Quixeré', neighborhood: 'Bairro Novo', street: 'Rua do Sol, 789' },
  { city: 'Tabuleiro do Norte', neighborhood: 'Vila Verde', street: 'Rua da Paz, 321' },
  { city: 'Morada Nova', neighborhood: 'Cidade Alta', street: 'Av. Central, 654' },
  { city: 'Icó', neighborhood: 'Centro', street: 'Rua São José, 987' },
  { city: 'Jaguaruana', neighborhood: 'Nova Jaguaruana', street: 'Rua das Acácias, 111' },
  { city: 'Aracati', neighborhood: 'Praia', street: 'Av. Beira Mar, 222' }
];

    type ListingType = "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" | "OUTRO";

    const types: ListingType[] = ["CASA", "APARTAMENTO", "KITNET", "QUARTO", "SITIO", "OUTRO"];

    for (let i = 0; i < 40; i++) {
    const cityIndex = i % cities.length;
    const userIndex = i % userIds.length;
    const typeIndex = i % types.length;

    listings.push({
        title: `${types[typeIndex]} disponível ${i + 1}`,
        description: `Descrição do imóvel ${i + 1}`,
        type: types[typeIndex]!,
        category: 'RESIDENTIAL',
        basePrice: 1000 + (i * 50), // preço crescente
        iptu: 100 + (i * 5),
        userId: userIds[userIndex]!,
        address: {
        zipCode: '62900000',
        state: 'CE',
        city: cities[cityIndex]!.city,
        neighborhood: cities[cityIndex]!.neighborhood,
        street: cities[cityIndex]!.street,
        reference: 'Perto de ponto de referência'
        },
        details: {
        area: 50 + (i * 2),
        bedrooms: 1 + (i % 4),
        bathrooms: 1 + (i % 3),
        doesntPayWaterBill: i % 2 === 0,
        hasGarage: i % 3 !== 0,
        isPetFriendly: i % 4 !== 0,
        hasCeramicFlooring: true,
        hasCeilingLining: i % 2 === 0,
        hasBackyard: i % 5 === 0,
        hasPool: i % 6 === 0,
        hasSolarPanel: i % 7 === 0,
        }
    });
    }

console.log(listings);


    for (const l of listings) {
      const { id } = await createListing.execute(l);
      console.log(`Listing criado (${l.title}): ${id}`);
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {

  }
})();
