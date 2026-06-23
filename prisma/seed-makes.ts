import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UK_CARS: Record<string, string[]> = {
  "Audi": ["A1","A2","A3","A4","A5","A6","A7","A8","Q2","Q3","Q4 e-tron","Q5","Q7","Q8","TT","R8","e-tron","RS3","RS4","RS5","RS6","RS7","S3","S4","S5","S6","S7","S8","SQ5","SQ7","SQ8"],
  "BMW": ["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","8 Series","X1","X2","X3","X4","X5","X6","X7","Z4","i3","i4","i5","i7","iX","iX1","iX3","M2","M3","M4","M5","M8","XM"],
  "Ford": ["Fiesta","Focus","Puma","Kuga","EcoSport","Mondeo","Galaxy","S-Max","Mustang","Mustang Mach-E","Ranger","Transit","Transit Connect","Transit Custom","Transit Courier","Ka","Ka+","Edge","Explorer","Tourneo","Tourneo Connect","Tourneo Custom"],
  "Vauxhall": ["Corsa","Astra","Insignia","Mokka","Crossland","Grandland","Zafira","Meriva","Vivaro","Movano","Combo","Adam","Agila","Antara","Cascada","Signum","Tigra","Vectra","Viva"],
  "Mercedes-Benz": ["A-Class","B-Class","C-Class","E-Class","S-Class","CLA","CLS","GLA","GLB","GLC","GLC Coupe","GLE","GLE Coupe","GLS","G-Class","AMG GT","EQA","EQB","EQC","EQE","EQS","SL","SLC","V-Class","Sprinter","Vito"],
  "Volkswagen": ["Polo","Golf","Passat","Tiguan","T-Cross","T-Roc","Touareg","ID.3","ID.4","ID.5","ID.7","Arteon","Touran","Sharan","Caddy","Transporter","Crafter","Amarok","Phaeton","Scirocco","Up"],
  "Toyota": ["Yaris","Yaris Cross","Corolla","Camry","C-HR","RAV4","Land Cruiser","Aygo","Aygo X","Prius","Prius+","Hilux","Proace","Proace Verso","GR86","GR Yaris","GR Corolla","bZ4X","Verso","Auris","Avensis","Urban Cruiser"],
  "Honda": ["Jazz","Civic","Accord","HR-V","CR-V","ZR-V","e","e:Ny1","Legend","FR-V","Stream"],
  "Nissan": ["Micra","Juke","Qashqai","X-Trail","Leaf","Ariya","Navara","Pathfinder","370Z","400Z","GT-R","Note","Pulsar","Murano","Patrol"],
  "Hyundai": ["i10","i20","i30","i40","Tucson","Santa Fe","IONIQ","IONIQ 5","IONIQ 6","Kona","Bayon","Veloster","Nexo","Staria"],
  "Kia": ["Picanto","Rio","Ceed","ProCeed","Xceed","Sportage","Sorento","Niro","EV6","EV9","Stinger","Carnival","Soul","Stonic"],
  "Renault": ["Clio","Megane","Captur","Kadjar","Koleos","Zoe","Arkana","Austral","Scenic","Espace","Kangoo","Trafic","Master","Laguna","Twingo"],
  "Peugeot": ["108","208","308","408","508","2008","3008","5008","Partner","Expert","Boxer","107","207","307","407","607"],
  "Citroën": ["C1","C3","C3 Aircross","C4","C4 X","C5 X","C5 Aircross","Berlingo","Dispatch","Relay","C-Crosser","C-Elysée","DS3","DS4","DS5"],
  "Fiat": ["500","500X","500L","500e","Panda","Tipo","Punto","Bravo","Doblo","Ducato","Scudo","Qubo","Sedici","Stilo"],
  "SEAT": ["Ibiza","Leon","Arona","Ateca","Tarraco","Alhambra","Mii","Exeo","Toledo"],
  "Skoda": ["Fabia","Octavia","Superb","Kamiq","Karoq","Kodiaq","Enyaq","Enyaq Coupe","Rapid","Roomster","Citigo","Yeti"],
  "Volvo": ["S60","S90","V40","V60","V60 Cross Country","V90","V90 Cross Country","XC40","XC60","XC90","C40","C30","C70"],
  "Land Rover": ["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Sport","Range Rover Evoque","Range Rover Velar","Freelander","Series I","Series II","Series III"],
  "Jaguar": ["XE","XF","XJ","E-Pace","F-Pace","I-Pace","F-Type","S-Type","X-Type","XK"],
  "MINI": ["Hatch","Convertible","Clubman","Countryman","Paceman","Coupe","Roadster","Clubvan","Aceman"],
  "Porsche": ["911","Boxster","Cayman","Panamera","Cayenne","Macan","Taycan","Taycan Cross Turismo"],
  "Tesla": ["Model 3","Model S","Model X","Model Y","Cybertruck","Roadster"],
  "Lexus": ["IS","ES","GS","LS","UX","NX","RX","LX","LC","RC","CT","RZ"],
  "Mazda": ["2","3","6","CX-3","CX-30","CX-5","CX-60","CX-80","MX-5","MX-30","CX-3"],
  "Mitsubishi": ["Colt","Eclipse Cross","Outlander","L200","Pajero","ASX","Shogun","Galant","Carisma"],
  "Subaru": ["Impreza","Legacy","Outback","Forester","XV","BRZ","WRX","Solterra","Levorg"],
  "Suzuki": ["Alto","Swift","Ignis","Vitara","S-Cross","Jimny","Baleno","Across","SX4","Liana","Grand Vitara"],
  "Dacia": ["Sandero","Logan","Duster","Lodgy","Dokker","Spring","Jogger","Bigster"],
  "Alfa Romeo": ["Giulia","Stelvio","Giulietta","MiTo","4C","Tonale","Junior","Brera","Spider","147","156","159","166"],
  "Jeep": ["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Gladiator","Avenger","Commander"],
  "DS": ["DS3","DS4","DS5","DS7","DS9"],
  "Aston Martin": ["Vantage","DB11","DB12","DBS","DBX","Vanquish","Rapide","Virage","Cygnet","Valkyrie"],
  "Bentley": ["Continental GT","Flying Spur","Mulsanne","Bentayga","Arnage","Azure"],
  "Rolls-Royce": ["Ghost","Phantom","Wraith","Dawn","Cullinan","Spectre","Silver Shadow","Silver Spur"],
  "McLaren": ["570S","600LT","720S","765LT","GT","Artura","Senna","P1","Elva","750S"],
  "Maserati": ["Ghibli","Quattroporte","Levante","GranTurismo","GranCabrio","Grecale","MC20"],
  "Ferrari": ["296 GTB","488","F8 Tributo","Roma","Portofino","SF90","812 Superfast","812 GTS","Purosangue","296 GTS"],
  "Lamborghini": ["Huracán","Aventador","Urus","Revuelto","Sterrato"],
  "Lotus": ["Emira","Eletre","Evora","Exige","Elise","Esprit"],
  "Morgan": ["Plus Four","Plus Six","3 Wheeler","Super 3"],
  "Caterham": ["Seven 170","Seven 270","Seven 310","Seven 360","Seven 420","Seven 485","Seven 620"],
  "Genesis": ["G70","G80","G90","GV70","GV80","GV60"],
  "Polestar": ["1","2","3","4"],
  "BYD": ["Atto 3","Seal","Dolphin","Han","Tang"],
  "MG": ["3","ZS","HS","5","Marvel R","4","Cyberster","ZT","TF","RV8"],
  "Chevrolet": ["Spark","Aveo","Cruze","Orlando","Captiva","Camaro","Corvette","Tahoe","Suburban"],
  "Chrysler": ["300C","Grand Voyager","PT Cruiser","Sebring","Delta","Ypsilon"],
  "Dodge": ["Challenger","Charger","Durango","Journey","Caliber"],
  "Isuzu": ["D-Max","MU-X","Trooper"],
  "Infiniti": ["Q30","Q50","Q60","QX30","QX50","QX70","QX80"],
  "Ssangyong": ["Tivoli","Korando","Rexton","Musso","Rodius"],
  "Daihatsu": ["Cuore","Sirion","Terios","Copen","Materia","Charade"],
  "Proton": ["Gen-2","Satria","Savvy","Persona","Preve","Suprima S"],
  "Smart": ["Fortwo","Forfour","Roadster","#1","#3"],
  "Aixam": ["City","Coupé","Crossline","Vision"],
  "Ligier": ["JS50","JS60","IXO"],
  "Microcar": ["M.Go","Due"],
  "INEOS": ["Grenadier"],
  "Lynk & Co": ["01","02","03"],
  "Nio": ["ET5","ET7","ES6","ES8","EL7"],
  "Xpeng": ["G3","P5","P7","G9"],
  "Great Wall": ["Steed","Ora Funky Cat"],
  "Alpine": ["A110"],
  "Cupra": ["Born","Formentor","Leon","Ateca","Terramar"],
  "Lucid": ["Air"],
  "Rivian": ["R1T","R1S"],
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  console.log("Importing UK car makes and models...");
  let makeCount = 0;
  let modelCount = 0;

  for (const [makeName, models] of Object.entries(UK_CARS)) {
    const slug = slugify(makeName);
    const make = await prisma.make.upsert({
      where: { name: makeName },
      update: {},
      create: { name: makeName, slug },
    });
    makeCount++;

    for (const modelName of models) {
      const modelSlug = slugify(modelName);
      await prisma.model.upsert({
        where: { makeId_name: { makeId: make.id, name: modelName } },
        update: {},
        create: { name: modelName, slug: modelSlug, makeId: make.id },
      });
      modelCount++;
    }
  }

  console.log(`✅ Imported ${makeCount} makes and ${modelCount} models.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
