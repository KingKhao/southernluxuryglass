import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Emerald Depression Glass Compote",
    category: "Serveware",
    price: 68,
    description:
      "A hand-blown emerald green compote dish from the 1930s, perfect for serving fruit or displaying trinkets. Minor surface wear consistent with age.",
    imageUrl: "https://placehold.co/800x600/2F4A3D/FAF6EE?font=playfair-display&text=Emerald+Compote",
    featured: true,
  },
  {
    name: "Cranberry Cut-Glass Vase",
    category: "Vases",
    price: 145,
    description:
      "A stunning ruby-to-clear cut glass vase with a scalloped rim, likely English, circa 1900. A true statement piece for any mantel.",
    imageUrl: "https://placehold.co/800x600/7B2D3E/FAF6EE?font=playfair-display&text=Cranberry+Vase",
    featured: true,
  },
  {
    name: "Set of 6 Etched Cordial Glasses",
    category: "Glasses",
    price: 92,
    description:
      "Delicate hand-etched cordial glasses with a floral vine motif, each holding about 2 oz. A lovely addition to any formal table setting.",
    imageUrl: "https://placehold.co/800x600/B08D57/2A2621?font=playfair-display&text=Cordial+Glasses",
    featured: true,
  },
  {
    name: "Milk Glass Hobnail Bowl",
    category: "Decor",
    price: 38,
    description:
      "Classic hobnail-pattern milk glass bowl in excellent condition, great for candy, potpourri, or as a standalone decorative piece.",
    imageUrl: "https://placehold.co/800x600/F3ECDD/2A2621?font=playfair-display&text=Hobnail+Bowl",
    featured: false,
  },
  {
    name: "Vintage Amber Dinnerware Set (8 pc)",
    category: "Dinnerware",
    price: 210,
    description:
      "An 8-piece amber pressed glass dinnerware set including plates and bowls, sold as a matched set from a 1970s estate collection.",
    imageUrl: "https://placehold.co/800x600/A8752E/FAF6EE?font=playfair-display&text=Amber+Dinnerware",
    featured: false,
  },
  {
    name: "Fenton Carnival Glass Pitcher",
    category: "Serveware",
    price: 175,
    description:
      "A radiant iridescent carnival glass pitcher by Fenton, featuring a grape-and-leaf pattern. A collector favorite in wonderful condition.",
    imageUrl: "https://placehold.co/800x600/2F4A3D/FAF6EE?font=playfair-display&text=Carnival+Pitcher",
    featured: false,
  },
  {
    name: "Art Deco Smoked Glass Vase",
    category: "Vases",
    price: 88,
    description:
      "A sleek smoked-glass vase with clean geometric lines, embodying the Art Deco aesthetic of the 1920s-30s.",
    imageUrl: "https://placehold.co/800x600/3F3B36/FAF6EE?font=playfair-display&text=Smoked+Vase",
    featured: false,
  },
  {
    name: "Hand-Painted Cordial Decanter",
    category: "Decor",
    price: 130,
    description:
      "A petite decanter hand-painted with gold filigree detailing, a charming accent for a bar cart or curio cabinet.",
    imageUrl: "https://placehold.co/800x600/B08D57/2A2621?font=playfair-display&text=Cordial+Decanter",
    featured: false,
  },
  {
    name: "Pressed Glass Tumbler Set (4 pc)",
    category: "Glasses",
    price: 54,
    description:
      "A set of four matching pressed glass tumblers with a diamond-point pattern, sturdy and full of everyday vintage charm.",
    imageUrl: "https://placehold.co/800x600/2F4A3D/FAF6EE?font=playfair-display&text=Pressed+Tumblers",
    featured: false,
  },
  {
    name: "Depression-Era Cake Stand",
    category: "Serveware",
    price: 76,
    description:
      "A pale pink Depression glass cake stand with a scalloped edge — as lovely for display as it is for serving.",
    imageUrl: "https://placehold.co/800x600/D9A6AE/2A2621?font=playfair-display&text=Cake+Stand",
    featured: false,
  },
];

const events = [
  {
    title: "Vintage Vases & Décor Live Sale",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    platformLink: "https://www.whatnot.com/",
    platformName: "Whatnot",
  },
  {
    title: "Estate Dinnerware Collection Reveal",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
    platformLink: "https://www.instagram.com/",
    platformName: "Instagram Live",
  },
  {
    title: "Cordial Glasses & Barware Auction",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
    platformLink: "https://www.whatnot.com/",
    platformName: "Whatnot",
  },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.product.createMany({ data: products });
  await prisma.event.createMany({ data: events });

  const username = process.env.ADMIN_USERNAME ?? "crystal";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: { username, passwordHash },
  });

  console.log(`Seeded ${products.length} products and ${events.length} events.`);
  console.log(`Admin login -> username: "${username}", password: "${password}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
