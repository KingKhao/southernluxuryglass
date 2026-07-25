import { PrismaClient, type ContactCategory } from "@prisma/client";

const prisma = new PrismaClient();

// Sample contacts to showcase category filtering. Every name ends in "(Sample)"
// and every email is on @example.com, so they're easy to spot and delete later.
const SAMPLES: {
  name: string;
  email: string;
  phone: string;
  category: ContactCategory;
  productOfInterest: string;
}[] = [
  { name: "Amelia Hartwell (Sample)", email: "amelia.hartwell.sample@example.com", phone: "(843) 555-0142", category: "NEW", productOfInterest: "Cranberry Cut-Glass Vase" },
  { name: "Benjamin Cole (Sample)", email: "ben.cole.sample@example.com", phone: "(843) 555-0170", category: "NEW", productOfInterest: "General inquiry" },
  { name: "Charlotte Reyes (Sample)", email: "charlotte.reyes.sample@example.com", phone: "(912) 555-0188", category: "NEW", productOfInterest: "Set of 6 Etched Cordial Glasses" },
  { name: "Diana Fairbanks (Sample)", email: "diana.fairbanks.sample@example.com", phone: "(704) 555-0119", category: "FOLLOWER", productOfInterest: "Milk Glass Hobnail Bowl" },
  { name: "Ethan Whitmore (Sample)", email: "ethan.whitmore.sample@example.com", phone: "(615) 555-0133", category: "FOLLOWER", productOfInterest: "General inquiry" },
  { name: "Fiona Delacroix (Sample)", email: "fiona.delacroix.sample@example.com", phone: "(404) 555-0155", category: "FOLLOWER", productOfInterest: "Art Deco Smoked Glass Vase" },
  { name: "Grace Sullivan (Sample)", email: "grace.sullivan.sample@example.com", phone: "(843) 555-0161", category: "BUYER", productOfInterest: "Fenton Carnival Glass Pitcher" },
  { name: "Henry Abbott (Sample)", email: "henry.abbott.sample@example.com", phone: "(919) 555-0177", category: "BUYER", productOfInterest: "Vintage Amber Dinnerware Set" },
  { name: "Isabel Moreno (Sample)", email: "isabel.moreno.sample@example.com", phone: "(305) 555-0192", category: "B2B", productOfInterest: "Coastal Interiors — bulk sourcing" },
  { name: "Jackson Pierce (Sample)", email: "jackson.pierce.sample@example.com", phone: "(813) 555-0128", category: "B2B", productOfInterest: "Pierce Event Rentals — barware" },
];

async function main() {
  // Idempotent: clear any previous sample contacts first.
  const removed = await prisma.contact.deleteMany({
    where: { email: { endsWith: ".sample@example.com" } },
  });

  for (const s of SAMPLES) {
    await prisma.contact.create({ data: s });
  }

  console.log(`Removed ${removed.count} old sample contacts, inserted ${SAMPLES.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
