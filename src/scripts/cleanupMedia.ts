import { Media, PrismaClient } from '../generated/prisma';
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

export async function cleanupMedia() {
  console.log("🔍 Iniciando limpeza de mídias...");

  // 1️⃣ Busca todas as mídias no banco
  const medias: Media[] = await prisma.media.findMany();
  const mediaPaths = new Set(medias.map((m: Media) => path.basename(m.url)));

  // 2️⃣ Lista todos os arquivos na pasta /uploads
  const filesOnDisk: string[] = await fs.readdir(UPLOAD_DIR);

  // --- PARTE A: arquivos no disco que não existem no banco ---
  const orphanFiles = filesOnDisk.filter((f: string) => !mediaPaths.has(f));
  for (const file of orphanFiles) {
    const filePath = path.join(UPLOAD_DIR, file);
    try {
      await fs.unlink(filePath);
      console.log(`🗑️  Removido do disco: ${file}`);
    } catch (err) {
      console.error(`Erro ao deletar ${file}:`, err);
    }
  }

  // --- PARTE B: registros no banco cujo arquivo sumiu ---
  const missingFiles = medias.filter((m: Media) => {
    const filename = path.basename(m.url);
    return !filesOnDisk.includes(filename);
  });

  for (const media of missingFiles) {
    try {
      await prisma.media.delete({ where: { id: media.id } });
      console.log(`🗑️  Removido do banco: ${media.url}`);
    } catch (err) {
      console.error(`Erro ao deletar ${media.id}:`, err);
    }
  }

  console.log("✅ Limpeza concluída!");
  await prisma.$disconnect();
}

cleanupMedia().catch(err => {
  console.error("Erro geral:", err);
  prisma.$disconnect();
  process.exit(1);
});
