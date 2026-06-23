import { PrismaClient, VehicleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // ---- Admin user ----
  const email = process.env.ADMIN_EMAIL || "admin@hawkmotors.co.uk";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Hawk Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  // ---- Site settings (single row) ----
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // ---- Categories ----
  const fuelNames = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const fuels: Record<string, string> = {};
  for (const name of fuelNames) {
    const f = await prisma.fuelType.upsert({ where: { name }, update: {}, create: { name } });
    fuels[name] = f.id;
  }

  const bodyNames = ["Saloon", "SUV", "Hatchback", "Coupe", "Estate"];
  const bodies: Record<string, string> = {};
  for (const name of bodyNames) {
    const b = await prisma.bodyStyle.upsert({ where: { name }, update: {}, create: { name } });
    bodies[name] = b.id;
  }

  const colourData = [
    { name: "Obsidian Black", hex: "#0b0b0d" },
    { name: "Storm Silver", hex: "#c5c7cd" },
    { name: "Glacier White", hex: "#f3f4f6" },
    { name: "Racing Red", hex: "#b91c1c" },
    { name: "Midnight Blue", hex: "#1e293b" },
  ];
  const colours: Record<string, string> = {};
  for (const c of colourData) {
    const row = await prisma.colour.upsert({ where: { name: c.name }, update: {}, create: c });
    colours[c.name] = row.id;
  }

  const makeModels: Record<string, string[]> = {
    "Mercedes-Benz": ["C-Class", "E-Class", "GLE"],
    BMW: ["M4", "3 Series", "X5"],
    Audi: ["Q5", "A6", "RS6"],
    "Land Rover": ["Range Rover Sport", "Defender"],
    Volkswagen: ["Golf R", "Tiguan"],
  };
  const modelIds: Record<string, string> = {};
  const makeIds: Record<string, string> = {};
  for (const [makeName, models] of Object.entries(makeModels)) {
    const make = await prisma.make.upsert({
      where: { name: makeName },
      update: {},
      create: { name: makeName, slug: slugify(makeName) },
    });
    makeIds[makeName] = make.id;
    for (const modelName of models) {
      const model = await prisma.model.upsert({
        where: { makeId_name: { makeId: make.id, name: modelName } },
        update: {},
        create: { name: modelName, slug: slugify(modelName), makeId: make.id },
      });
      modelIds[`${makeName}|${modelName}`] = model.id;
    }
  }

  // ---- Sample vehicles ----
  type Seed = {
    make: string; model: string; variant: string; year: number; price: number;
    mileage: number; fuel: string; body: string; colour: string; engine: string;
    hp: number; trans: string; drive: string; doors: number; seats: number;
    featured?: boolean; status?: VehicleStatus; images: string[]; youtube?: string;
    desc: string; features: string[];
  };

  const seeds: Seed[] = [
    {
      make: "Mercedes-Benz", model: "C-Class", variant: "C300 AMG Line Premium Plus",
      year: 2023, price: 38995, mileage: 12450, fuel: "Petrol", body: "Saloon",
      colour: "Storm Silver", engine: "2.0L", hp: 258, trans: "Automatic", drive: "RWD",
      doors: 4, seats: 5, featured: true, status: "AVAILABLE",
      images: ["1618843479313-40f8afb4b4d8", "1605559424843-9e4c228bf1c2", "1503376780353-7e6692767b70"],
      youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      desc: "A stunning C300 in AMG Line Premium Plus specification. Finished in Storm Silver over black leather, with full Mercedes service history and the balance of manufacturer warranty.",
      features: ["AMG Line Premium Plus", "Panoramic roof", "360° camera", "Burmester sound", "Heated electric memory seats", "Apple CarPlay & Android Auto"],
    },
    {
      make: "BMW", model: "M4", variant: "Competition xDrive",
      year: 2024, price: 74950, mileage: 4200, fuel: "Petrol", body: "Coupe",
      colour: "Obsidian Black", engine: "3.0L", hp: 510, trans: "Automatic", drive: "AWD",
      doors: 2, seats: 4, featured: true, status: "AVAILABLE",
      images: ["1555215695-3004980ad54e", "1552519507-da3b142c6e3d", "1544636331-e26879cd4d9b"],
      desc: "The M4 Competition xDrive — 510hp, 0-62 in 3.5s. One owner, immaculate throughout, carbon bucket seats and full M Carbon exterior package.",
      features: ["M Carbon bucket seats", "Carbon exterior package", "Laser headlights", "Head-up display", "Harman Kardon", "M Drive Professional"],
    },
    {
      make: "Land Rover", model: "Range Rover Sport", variant: "D300 Dynamic SE",
      year: 2023, price: 67500, mileage: 18900, fuel: "Diesel", body: "SUV",
      colour: "Obsidian Black", engine: "3.0L", hp: 300, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 5, featured: true, status: "RESERVED",
      images: ["1606664515524-ed2f786a0bd6", "1606220838315-056192d5e927"],
      desc: "Commanding Range Rover Sport D300 Dynamic SE. Air suspension, Meridian sound and panoramic roof. Reserved — register your interest for similar stock.",
      features: ["Air suspension", "Panoramic roof", "Meridian sound", "Matrix LED", "Heated & cooled seats", "Wireless charging"],
    },
    {
      make: "Audi", model: "RS6", variant: "Avant Carbon Black",
      year: 2022, price: 89995, mileage: 21500, fuel: "Petrol", body: "Estate",
      colour: "Storm Silver", engine: "4.0L", hp: 600, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 5, featured: true, status: "AVAILABLE",
      images: ["1614200187524-dc4b892acf16", "1606152421802-db97b9c7a11b"],
      desc: "The definitive super-estate. RS6 Avant in Carbon Black edition with 600hp twin-turbo V8, RS dynamic package plus and ceramic brakes.",
      features: ["Carbon Black edition", "Ceramic brakes", "RS dynamic package plus", "Dynamic ride control", "B&O 3D sound", "Sport exhaust"],
    },
    {
      make: "Audi", model: "Q5", variant: "40 TDI Quattro S Line",
      year: 2022, price: 33450, mileage: 27800, fuel: "Diesel", body: "SUV",
      colour: "Glacier White", engine: "2.0L", hp: 204, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 5, status: "AVAILABLE",
      images: ["1606220838315-056192d5e927", "1614200187524-dc4b892acf16"],
      desc: "Beautifully presented Q5 S Line with virtual cockpit, heated seats and a full service history.",
      features: ["S Line", "Virtual cockpit", "Heated seats", "Power tailgate", "LED headlights"],
    },
    {
      make: "Volkswagen", model: "Golf R", variant: "2.0 TSI 4MOTION",
      year: 2021, price: 28995, mileage: 31200, fuel: "Petrol", body: "Hatchback",
      colour: "Midnight Blue", engine: "2.0L", hp: 320, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 5, status: "AVAILABLE",
      images: ["1503376780353-7e6692767b70", "1544636331-e26879cd4d9b"],
      desc: "Hot-hatch royalty. Golf R 4MOTION with Akrapovič exhaust, DCC adaptive chassis and Harman Kardon.",
      features: ["Akrapovič exhaust", "DCC adaptive chassis", "Harman Kardon", "Digital cockpit pro", "Heated seats"],
    },
    {
      make: "BMW", model: "X5", variant: "xDrive40d M Sport",
      year: 2023, price: 58900, mileage: 16400, fuel: "Diesel", body: "SUV",
      colour: "Obsidian Black", engine: "3.0L", hp: 340, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 7, status: "AVAILABLE",
      images: ["1606664515524-ed2f786a0bd6", "1552519507-da3b142c6e3d"],
      desc: "Seven-seat X5 xDrive40d M Sport. Sky Lounge panoramic roof, Laser lights and comfort access.",
      features: ["7 seats", "Sky Lounge roof", "Laser lights", "Comfort access", "Harman Kardon", "Heated seats"],
    },
    {
      make: "Mercedes-Benz", model: "GLE", variant: "GLE 300d 4MATIC AMG Line",
      year: 2021, price: 44995, mileage: 29950, fuel: "Diesel", body: "SUV",
      colour: "Glacier White", engine: "2.0L", hp: 245, trans: "Automatic", drive: "AWD",
      doors: 5, seats: 5, status: "SOLD",
      images: ["1618843479313-40f8afb4b4d8", "1605559424843-9e4c228bf1c2"],
      desc: "GLE 300d AMG Line — now sold. We have similar models arriving; contact us to be notified.",
      features: ["AMG Line", "Airmatic suspension", "MBUX", "Burmester sound", "Keyless go"],
    },
  ];

  let i = 0;
  for (const s of seeds) {
    const slug = slugify(`${s.make}-${s.model}-${s.variant}-${s.year}-${++i}`);
    const vehicle = await prisma.vehicle.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: `${s.year} ${s.make} ${s.model} ${s.variant}`,
        status: s.status ?? "AVAILABLE",
        featured: s.featured ?? false,
        price: s.price,
        makeId: makeIds[s.make],
        modelId: modelIds[`${s.make}|${s.model}`],
        fuelTypeId: fuels[s.fuel],
        bodyStyleId: bodies[s.body],
        colourId: colours[s.colour],
        variant: s.variant,
        year: s.year,
        registration: `${String(s.year).slice(2)} ${["AB","CD","EF","GH"][i % 4]}${1000 + i}`,
        mileage: s.mileage,
        engineSize: s.engine,
        horsepower: s.hp,
        transmission: s.trans,
        drivetrain: s.drive,
        doors: s.doors,
        seats: s.seats,
        description: s.desc,
        features: s.features,
        serviceHistory: "Full service history",
        motExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 300),
        owners: (i % 3) + 1,
        warranty: "Minimum 6 months warranty included",
        metaTitle: `${s.year} ${s.make} ${s.model} ${s.variant} for sale | Hawk Motors`,
        metaDescription: s.desc.slice(0, 155),
      },
    });

    // media
    await prisma.media.deleteMany({ where: { vehicleId: vehicle.id } });
    let pos = 0;
    for (const id of s.images) {
      await prisma.media.create({
        data: { vehicleId: vehicle.id, type: "IMAGE", url: img(id), position: pos++, alt: vehicle.title },
      });
    }
    if (s.youtube) {
      await prisma.media.create({
        data: { vehicleId: vehicle.id, type: "VIDEO_YOUTUBE", url: s.youtube, embedUrl: s.youtube, position: pos++, alt: `${vehicle.title} walkaround` },
      });
    }
  }

  // ---- Sample enquiries ----
  const firstVehicle = await prisma.vehicle.findFirst();
  await prisma.enquiry.createMany({
    data: [
      { name: "James Carter", email: "james@example.com", phone: "07700 900123", message: "Is the C300 still available? Keen to view this weekend.", vehicleId: firstVehicle?.id, vehicleTitle: firstVehicle?.title, type: "EMAIL", status: "NEW" },
      { name: "Priya Shah", phone: "07700 900456", message: "Please call me back about part exchange.", type: "CALLBACK", status: "CONTACTED" },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
