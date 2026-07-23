import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Category display order (mirrors what shows in the gallery filters).
const categories = ["Vases", "Glasses", "Serveware", "Decor", "Dinnerware"];

// Demo inventory for the alpha build. Photos are branded placeholders — swap
// them for Crystal's own photography (or royalty-free stock) from the admin.
const products = [
  {
    name: "Emerald Depression Glass Compote",
    category: "Serveware",
    price: 68,
    description:
      "A hand-blown emerald green compote from the 1930s, back when Depression glass was slipped free into cereal boxes and movie tickets. The color still catches the light beautifully; minor surface wear tells its ninety-year story.",
    images: ["https://images.unsplash.com/photo-1712495023077-87b30e5ba50a?auto=format&fit=crop&w=1000&q=70"],
    featured: true,
  },
  {
    name: "Cranberry Cut-Glass Vase",
    category: "Vases",
    price: 145,
    description:
      "A ruby-to-clear cut glass vase with a scalloped rim, likely English and circa 1900. The cranberry hue was achieved by adding real gold to the molten glass — a true statement piece for a mantel.",
    images: ["https://images.unsplash.com/photo-1598995651120-2f3150be6cf4?auto=format&fit=crop&w=1000&q=70"],
    featured: true,
  },
  {
    name: "Set of 6 Etched Cordial Glasses",
    category: "Glasses",
    price: 92,
    description:
      "Six delicate cordial glasses, each hand-etched with a trailing floral vine and holding about two ounces. Rescued from a Charleston estate sale, they're made for after-dinner sherry and good conversation.",
    images: ["https://images.unsplash.com/photo-1667173199918-0873ae8dab40?auto=format&fit=crop&w=1000&q=70"],
    featured: true,
  },
  {
    name: "Milk Glass Hobnail Bowl",
    category: "Decor",
    price: 38,
    description:
      "A classic Fenton-style hobnail bowl in creamy milk glass, its raised dots as crisp as the day it was pressed. Excellent condition — lovely for candy, potpourri, or simply catching the afternoon sun.",
    images: ["https://images.unsplash.com/photo-1636389896270-4054a6c5bcdd?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Vintage Amber Dinnerware Set (8 pc)",
    category: "Dinnerware",
    price: 210,
    description:
      "An eight-piece amber pressed-glass dinnerware set from a 1970s estate, sold as a matched collection. The warm honey tone makes an autumn table glow — plates and bowls, all free of chips.",
    images: ["https://images.unsplash.com/photo-1647036939425-caa6365bb8f9?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Fenton Carnival Glass Pitcher",
    category: "Serveware",
    price: 175,
    description:
      "A radiant iridescent pitcher by Fenton in a grape-and-leaf pattern, its oil-on-water shimmer earning carnival glass the nickname 'the poor man's Tiffany.' A collector favorite in wonderful condition.",
    images: ["https://images.unsplash.com/photo-1774294731362-a0b75597c94d?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Art Deco Smoked Glass Vase",
    category: "Vases",
    price: 88,
    description:
      "A sleek smoked-glass vase with clean geometric lines, straight out of the 1920s–30s Art Deco moment. The subtle grey tint reads modern and antique all at once.",
    images: ["https://images.unsplash.com/photo-1712245833868-752590cb07e1?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Hand-Painted Cordial Decanter",
    category: "Decor",
    price: 130,
    description:
      "A petite decanter hand-painted with gold filigree, the gilt still bright along its stopper. A charming accent for a bar cart or curio cabinet — equal parts pretty and practical.",
    images: ["https://images.unsplash.com/photo-1589807502973-c7be2ee95d99?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Pressed Glass Tumbler Set (4 pc)",
    category: "Glasses",
    price: 54,
    description:
      "Four matching tumblers in a crisp diamond-point pattern, sturdy enough for everyday and pretty enough for company. Honest vintage charm with no chips or cloudiness.",
    images: ["https://images.unsplash.com/photo-1659815146192-6e92d977548a?auto=format&fit=crop&w=1000&q=70"],
    featured: false,
  },
  {
    name: "Depression-Era Cake Stand",
    category: "Serveware",
    price: 76,
    description:
      "A pale pink Depression glass cake stand with a scalloped edge, the kind that held Sunday layer cakes for generations. As lovely holding fruit or jewelry as it is a dessert.",
    images: ["https://images.unsplash.com/photo-1647036939635-c95119966b24?auto=format&fit=crop&w=1000&q=70"],
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
  await prisma.category.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();

  const categoryIdByName: Record<string, string> = {};
  for (let i = 0; i < categories.length; i++) {
    const created = await prisma.category.create({
      data: { name: categories[i], sortOrder: i },
    });
    categoryIdByName[categories[i]] = created.id;
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        description: p.description,
        images: p.images,
        featured: p.featured,
        categoryId: categoryIdByName[p.category],
      },
    });
  }

  await prisma.event.createMany({ data: events });

  const username = process.env.ADMIN_USERNAME ?? "crystal";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.create({ data: { username, passwordHash } });

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products and ${events.length} events.`
  );
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
