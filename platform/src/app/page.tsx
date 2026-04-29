import Hero from "@/components/hero";

async function fetchStars(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export default async function Home() {
  const [starsPersonal, starsANC, starsLR] = await Promise.all([
    fetchStars("ThoBustos/thomasbustosv2"),
    fetchStars("ThoBustos/ainativeclub"),
    fetchStars("ThoBustos/learnrep"),
  ]);

  const stars: Record<string, number> = {
    "ThoBustos/thomasbustosv2": starsPersonal,
    "ThoBustos/ainativeclub":   starsANC,
    "ThoBustos/learnrep":       starsLR,
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <Hero stars={stars} />
    </main>
  );
}
