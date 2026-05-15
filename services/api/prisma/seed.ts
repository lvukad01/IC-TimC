import {
  BookingStatus,
  DepositType,
  EmployeeRole,
  MediaType,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  PrismaClient,
  SalonCategory,
  SalonStatus,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.favorites.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.payments.deleteMany();
  await prisma.bookings.deleteMany();
  await prisma.timeOff.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.employeeServices.deleteMany();
  await prisma.employees.deleteMany();
  await prisma.services.deleteMany();
  await prisma.salonMedia.deleteMany();
  await prisma.salonCategories.deleteMany();
  await prisma.salonPaymentConfig.deleteMany();
  await prisma.salons.deleteMany();
  await prisma.serviceCategories.deleteMany();

  const password = await bcrypt.hash('Password123!', 10);

  const hair = await prisma.serviceCategories.create({
    data: { name: 'Hair', slug: 'hair' },
  });

  const nails = await prisma.serviceCategories.create({
    data: { name: 'Nails', slug: 'nails' },
  });

  const makeup = await prisma.serviceCategories.create({
    data: { name: 'Makeup', slug: 'makeup' },
  });

  const barber = await prisma.serviceCategories.create({
    data: { name: 'Barbershop', slug: 'barbershop' },
  });

  const owner1 = await prisma.users.upsert({
    where: { email: 'owner1@lumii.test' },
    update: {},
    create: {
      email: 'owner1@lumii.test',
      firstName: 'Mia',
      lastName: 'Horvat',
      password,
      phone: '+385911111111',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Zagreb',
      zipcode: '10000',
      street: 'Ilica 15',
      lat: 45.815,
      lng: 15.9819,
    },
  });

  const owner2 = await prisma.users.upsert({
    where: { email: 'owner2@lumii.test' },
    update: {},
    create: {
      email: 'owner2@lumii.test',
      firstName: 'Ana',
      lastName: 'Marić',
      password,
      phone: '+385922222222',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Split',
      zipcode: '21000',
      street: 'Riva 10',
      lat: 43.5081,
      lng: 16.4402,
    },
  });

  const owner3 = await prisma.users.upsert({
    where: { email: 'owner3@lumii.test' },
    update: {},
    create: {
      email: 'owner3@lumii.test',
      firstName: 'Petra',
      lastName: 'Kovač',
      password,
      phone: '+385933333333',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Rijeka',
      zipcode: '51000',
      street: 'Korzo 5',
      lat: 45.3271,
      lng: 14.4422,
    },
  });

  const owner4 = await prisma.users.upsert({
    where: { email: 'owner4@lumii.test' },
    update: {},
    create: {
      email: 'owner4@lumii.test',
      firstName: 'Dorian',
      lastName: 'Leci',
      password,
      phone: '+385934334333',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Virovitica',
      zipcode: '33000',
      street: 'Zinke Kunc 9',
      lat: 45.3271,
      lng: 14.4422,
    },
  });

  const owner5 = await prisma.users.upsert({
    where: { email: 'owner5@lumii.test' },
    update: {},
    create: {
      email: 'owner5@lumii.test',
      firstName: 'Ivana',
      lastName: 'Barišić',
      password,
      phone: '+385955555555',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Zadar',
      zipcode: '23000',
      street: 'Obala kneza Branimira 3',
      lat: 44.1194,
      lng: 15.2314,
    },
  });

  const owner6 = await prisma.users.upsert({
    where: { email: 'owner6@lumii.test' },
    update: {},
    create: {
      email: 'owner6@lumii.test',
      firstName: 'Luka',
      lastName: 'Jurić',
      password,
      phone: '+385966666666',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Osijek',
      zipcode: '31000',
      street: 'Europska avenija 18',
      lat: 45.554,
      lng: 18.695,
    },
  });

  const owner7 = await prisma.users.upsert({
    where: { email: 'owner7@lumii.test' },
    update: {},
    create: {
      email: 'owner7@lumii.test',
      firstName: 'Martina',
      lastName: 'Šarić',
      password,
      phone: '+385977777777',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Pula',
      zipcode: '52100',
      street: 'Flanatička 12',
      lat: 44.8666,
      lng: 13.8496,
    },
  });

  const owner8 = await prisma.users.upsert({
    where: { email: 'owner8@lumii.test' },
    update: {},
    create: {
      email: 'owner8@lumii.test',
      firstName: 'Marko',
      lastName: 'Perković',
      password,
      phone: '+385988888888',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Šibenik',
      zipcode: '22000',
      street: 'Obala Hrvatske mornarice 7',
      lat: 43.735,
      lng: 15.889,
    },
  });

  const owner9 = await prisma.users.upsert({
    where: { email: 'owner9@lumii.test' },
    update: {},
    create: {
      email: 'owner9@lumii.test',
      firstName: 'Nina',
      lastName: 'Radić',
      password,
      phone: '+385999999999',
      role: UserRole.SALON_OWNER,
      country: 'Croatia',
      city: 'Karlovac',
      zipcode: '47000',
      street: 'Trg bana Josipa Jelačića 2',
      lat: 45.4872,
      lng: 15.5478,
    },
  });

  const client = await prisma.users.upsert({
    where: { email: 'client@lumii.test' },
    update: {},
    create: {
      email: 'client@lumii.test',
      firstName: 'Lana',
      lastName: 'Vukadin',
      password,
      phone: '+385922222222',
      role: UserRole.CLIENT,
      country: 'Croatia',
      city: 'Zagreb',
      zipcode: '10000',
      street: 'Savska 25',
    },
  });

  const admin = await prisma.users.upsert({
    where: { email: 'admin@lumii.test' },
    update: {},
    create: {
      email: 'admin@lumii.test',
      firstName: 'Admin',
      lastName: 'User',
      password,
      role: UserRole.ADMIN,
      country: 'Croatia',
      city: 'Zagreb',
      zipcode: '10000',
      street: 'Savska 25',
      lat: null,
      lng: null,
    },
  });

  const salon = await prisma.salons.create({
    data: {
      ownerId: owner1.id,
      name: 'Lumii Beauty Studio',
      country: 'Croatia',
      city: 'Zagreb',
      zipcode: '10000',
      street: 'Vlaška 20',
      lat: 45.813,
      lng: 15.987,
      status: SalonStatus.ACTIVE,
      categories: {
        create: [
          { category: SalonCategory.HAIR },
          { category: SalonCategory.NAILS },
          { category: SalonCategory.MAKEUP },
        ],
      },
      media: {
        create: [
          {
            key: 'lumii_beauty_studio.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'lumii_beauty_studio_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
      config: {
        create: {
          depositType: DepositType.PERCENTAGE,
          depositValue: 20,
        },
      },
    },
  });
  const salon2 = await prisma.salons.create({
    data: {
      ownerId: owner1.id,
      name: 'Glow Beauty',
      country: 'Croatia',
      city: 'Split',
      zipcode: '21000',
      street: 'Marmontova 10',
      lat: 43.5081,
      lng: 16.4402,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-01'),
      categories: {
        create: [
          { category: SalonCategory.NAILS },
          { category: SalonCategory.MAKEUP },
        ],
      },
      media: {
        create: [
          {
            key: 'glow_studio_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'glow_studio_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon3 = await prisma.salons.create({
    data: {
      ownerId: owner2.id,
      name: 'Barber House',
      country: 'Croatia',
      city: 'Rijeka',
      zipcode: '51000',
      street: 'Korzo 5',
      lat: 45.3271,
      lng: 14.4422,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-10'),
      categories: {
        create: [{ category: SalonCategory.BARBERSHOP }],
      },
      media: {
        create: [
          {
            key: 'barber_house_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'barber_house_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon4 = await prisma.salons.create({
    data: {
      ownerId: owner2.id,
      name: 'Luxe Hair Studio',
      country: 'Croatia',
      city: 'Zagreb',
      zipcode: '10000',
      street: 'Savska 40',
      lat: 45.805,
      lng: 15.97,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-15'),
      categories: {
        create: [{ category: SalonCategory.HAIR }],
      },
      media: {
        create: [
          {
            key: 'luxe_hair_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'luxe_hair_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon5 = await prisma.salons.create({
    data: {
      ownerId: owner3.id,
      name: 'Makeup Atelier',
      country: 'Croatia',
      city: 'Osijek',
      zipcode: '31000',
      street: 'Europska avenija 12',
      lat: 45.554,
      lng: 18.695,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-18'),
      categories: {
        create: [{ category: SalonCategory.MAKEUP }],
      },
      media: {
        create: [
          {
            key: 'makeup_atelier_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'makeup_atelier_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon7 = await prisma.salons.create({
    data: {
      ownerId: owner4.id,
      name: 'Velvet Nails',
      country: 'Croatia',
      city: 'Osijek',
      zipcode: '31000',
      street: 'Europska avenija 12',
      lat: 45.554,
      lng: 18.695,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-18'),
      categories: {
        create: [{ category: SalonCategory.NAILS }],
      },
      media: {
        create: [
          {
            key: 'velvet_nails_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const salon8 = await prisma.salons.create({
    data: {
      ownerId: owner5.id,
      name: 'Luna Beauty Lab',
      country: 'Croatia',
      city: 'Split',
      zipcode: '21000',
      street: 'Poljička cesta 32',
      lat: 43.5123,
      lng: 16.4632,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-22'),
      categories: {
        create: [{ category: SalonCategory.NAILS }],
      },
      media: {
        create: [
          {
            key: 'luna_beauty_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'luna_beauty_1.svg',
            type: MediaType.PROFILE,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon9 = await prisma.salons.create({
    data: {
      ownerId: owner6.id,
      name: 'Aura Hair Lounge',
      country: 'Croatia',
      city: 'Pula',
      zipcode: '52100',
      street: 'Forum 3',
      lat: 44.8666,
      lng: 13.8496,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-21'),
      categories: {
        create: [{ category: SalonCategory.HAIR }],
      },
      media: {
        create: [
          {
            key: 'aura_hair_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'aura_hair_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon10 = await prisma.salons.create({
    data: {
      ownerId: owner7.id,
      name: 'Gentleman Barber Studio',
      country: 'Croatia',
      city: 'Dubrovnik',
      zipcode: '20000',
      street: 'Stradun 12',
      lat: 42.6407,
      lng: 18.1084,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-22'),
      categories: {
        create: [{ category: SalonCategory.BARBERSHOP }],
      },
      media: {
        create: [
          {
            key: 'gentleman_barber_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const salon11 = await prisma.salons.create({
    data: {
      ownerId: owner8.id,
      name: 'Glow Skin & Beauty',
      country: 'Croatia',
      city: 'Šibenik',
      zipcode: '22000',
      street: 'Obala dr. Franje Tuđmana 6',
      lat: 43.735,
      lng: 15.8952,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-23'),
      categories: {
        create: [{ category: SalonCategory.MAKEUP }],
      },
      media: {
        create: [
          {
            key: 'glow_skin_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'glow_skin_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon12 = await prisma.salons.create({
    data: {
      ownerId: owner9.id,
      name: 'Studio Elegance',
      country: 'Croatia',
      city: 'Varaždin',
      zipcode: '42000',
      street: 'Kapucinski trg 4',
      lat: 46.3057,
      lng: 16.3366,
      status: SalonStatus.ACTIVE,
      createdAt: new Date('2026-05-24'),
      categories: {
        create: [
          { category: SalonCategory.HAIR },
          { category: SalonCategory.MAKEUP },
        ],
      },
      media: {
        create: [
          {
            key: 'studio_elegance_profile.svg',
            type: MediaType.PROFILE,
            sortOrder: 0,
          },
          {
            key: 'studio_elegance_1.svg',
            type: MediaType.GALLERY,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const haircut = await prisma.services.create({
    data: {
      salonId: salon.id,
      categoryId: hair.id,
      name: 'Women Haircut',
      price: 35,
      durationMin: 45,
    },
  });

  const manicure = await prisma.services.create({
    data: {
      salonId: salon.id,
      categoryId: nails.id,
      name: 'Gel Manicure',
      price: 28,
      durationMin: 60,
    },
  });

  const makeupService = await prisma.services.create({
    data: {
      salonId: salon.id,
      categoryId: makeup.id,
      name: 'Evening Makeup',
      price: 50,
      durationMin: 75,
    },
  });

  const employee1 = await prisma.employees.create({
    data: {
      salonId: salon.id,
      name: 'Ana Kovač',
      role: EmployeeRole.HAIRDRESSER,
      workingHours: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
        ],
      },
    },
  });

  const employee2 = await prisma.employees.create({
    data: {
      salonId: salon.id,
      name: 'Petra Babić',
      role: EmployeeRole.NAIL_TECH,
      workingHours: {
        create: [
          { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
        ],
      },
    },
  });

  await prisma.employeeServices.createMany({
    data: [
      { employeeId: employee1.id, serviceId: haircut.id },
      { employeeId: employee1.id, serviceId: makeupService.id },
      { employeeId: employee2.id, serviceId: manicure.id },
    ],
  });

  const booking = await prisma.bookings.create({
    data: {
      clientId: client.id,
      salonId: salon.id,
      serviceId: haircut.id,
      employeeId: employee1.id,
      startTime: new Date('2026-05-20T10:00:00.000Z'),
      endTime: new Date('2026-05-20T10:45:00.000Z'),
      status: BookingStatus.CONFIRMED,
    },
  });

  await prisma.payments.create({
    data: {
      clientId: client.id,
      bookingId: booking.id,
      amount: 7,
      method: PaymentMethod.CARD,
      type: PaymentType.DEPOSIT,
      status: PaymentStatus.PAID,
      externalId: 'mock_payment_001',
    },
  });

  await prisma.reviews.create({
    data: {
      bookingId: booking.id,
      clientId: client.id,
      salonId: salon.id,
      rating: 5,
      comment: 'Great service and friendly staff!',
    },
  });

  await prisma.services.createMany({
    data: [
      {
        salonId: salon2.id,
        categoryId: nails.id,
        name: 'Russian Manicure',
        price: 40,
        durationMin: 90,
      },
      {
        salonId: salon3.id,
        categoryId: barber.id,
        name: 'Fade Cut',
        price: 20,
        durationMin: 30,
      },
      {
        salonId: salon4.id,
        categoryId: hair.id,
        name: 'Hair Coloring',
        price: 70,
        durationMin: 120,
      },
      {
        salonId: salon5.id,
        categoryId: makeup.id,
        name: 'Bridal Makeup',
        price: 120,
        durationMin: 120,
      },
      {
        salonId: salon7.id,
        categoryId: nails.id,
        name: 'Classic Manicure',
        price: 30,
        durationMin: 60,
      },
      {
        salonId: salon8.id,
        categoryId: nails.id,
        name: 'Gel Nails',
        price: 35,
        durationMin: 75,
      },
      {
        salonId: salon9.id,
        categoryId: hair.id,
        name: 'Blow Dry',
        price: 25,
        durationMin: 40,
      },
      {
        salonId: salon10.id,
        categoryId: barber.id,
        name: 'Beard Trim',
        price: 15,
        durationMin: 25,
      },
      {
        salonId: salon11.id,
        categoryId: makeup.id,
        name: 'Daily Makeup',
        price: 45,
        durationMin: 60,
      },
      {
        salonId: salon12.id,
        categoryId: hair.id,
        name: 'Hair Styling',
        price: 55,
        durationMin: 90,
      },
    ],
  });

  const salons = [
    salon,
    salon2,
    salon3,
    salon4,
    salon5,
    salon7,
    salon8,
    salon9,
    salon10,
    salon11,
    salon12,
  ];

  const reviewComments = [
    'Amazing experience!',
    'Very professional staff.',
    'Would definitely come again.',
    'Super clean and modern salon.',
    'Loved the result!',
    'Friendly atmosphere and great service.',
    'Best salon experience so far.',
    'Highly recommended.',
    'Everything was perfect.',
    'Fast and quality service.',
  ];

  for (let i = 0; i < salons.length; i++) {
    const selectedSalon = salons[i];

    const service = await prisma.services.findFirst({
      where: {
        salonId: selectedSalon.id,
      },
    });

    if (!service) continue;

    const employee = await prisma.employees.create({
      data: {
        salonId: selectedSalon.id,
        name: `Employee ${selectedSalon.name}`,
        role: EmployeeRole.HAIRDRESSER,
        workingHours: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          ],
        },
      },
    });

    await prisma.employeeServices.create({
      data: {
        employeeId: employee.id,
        serviceId: service.id,
      },
    });

    const salonBooking = await prisma.bookings.create({
      data: {
        clientId: client.id,
        salonId: selectedSalon.id,
        serviceId: service.id,
        employeeId: employee.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        status: BookingStatus.COMPLETED,
      },
    });

    await prisma.reviews.create({
      data: {
        bookingId: salonBooking.id,
        clientId: client.id,
        salonId: selectedSalon.id,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: reviewComments[i % reviewComments.length],
      },
    });
  }

  console.log('Seed completed.');
  console.log('Owner login: owner@lumii.test / Password123!');
  console.log('Client login: client@lumii.test / Password123!');
  console.log('Admin login: admin@lumii.test / Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
