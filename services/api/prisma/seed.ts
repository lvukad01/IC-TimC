import {
  PrismaClient,
  UserRole,
  SalonStatus,
  SalonCategory,
  EmployeeRole,
  MediaType,
  DepositType,
  PaymentMethod,
  PaymentType,
  PaymentStatus,
  BookingStatus,
  NotificationType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.notifications.deleteMany();
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
  await prisma.favorites.deleteMany();
  await prisma.salons.deleteMany();
  await prisma.users.deleteMany();
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

  const owner = await prisma.users.create({
    data: {
      email: 'owner@lumii.test',
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

  const client = await prisma.users.create({
    data: {
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

  const admin = await prisma.users.create({
    data: {
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
      ownerId: owner.id,
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
            key: 'salons/lumii/profile.jpg',
            type: MediaType.PROFILE,
            sortOrder: 1,
          },
          {
            key: 'salons/lumii/gallery-1.jpg',
            type: MediaType.GALLERY,
            sortOrder: 2,
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
      ownerId: owner.id,
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
            key: 'salons/glow/profile.jpg',
            type: MediaType.PROFILE,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon3 = await prisma.salons.create({
    data: {
      ownerId: owner.id,
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
            key: 'salons/barber/profile.jpg',
            type: MediaType.PROFILE,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon4 = await prisma.salons.create({
    data: {
      ownerId: owner.id,
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
            key: 'salons/luxe/profile.jpg',
            type: MediaType.PROFILE,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const salon5 = await prisma.salons.create({
    data: {
      ownerId: owner.id,
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
            key: 'salons/atelier/profile.jpg',
            type: MediaType.PROFILE,
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

  await prisma.favorites.create({
    data: {
      userId: client.id,
      salonId: salon.id,
    },
  });

  await prisma.notifications.createMany({
    data: [
      {
        userId: client.id,
        type: NotificationType.CONFIRMATION,
        content: 'Your booking has been confirmed.',
      },
      {
        userId: owner.id,
        type: NotificationType.REMINDER,
        content: 'You have an upcoming appointment.',
      },
      {
        userId: admin.id,
        type: NotificationType.CONFIRMATION,
        content: 'Mock data seeded successfully.',
      },
    ],
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
    ],
  });

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
