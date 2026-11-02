import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Cuestionario from "./Cuestionario";
import { createServerSupabase } from '@/lib/supabase-ssr'
import { supabaseConfigStatus } from '@/lib/supabase-env'

export const metadata: Metadata = {
  title: "Tu plan personalizado | WellnessReal",
  description:
    "Cuéntanos tu situación y te preparamos un plan de entrenamiento y nutrición personalizado con el método de Fernando Royano.",
  alternates: { canonical: "https://wellnessreal.es/cuestionario" },
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ origen?: string }> }) {
  const { origen } = await searchParams;
  if (origen !== "metodo-tiroides") redirect("/valoracion");
  if (!supabaseConfigStatus().ok) redirect('/comunidad/entrar')
  const auth = await createServerSupabase()
  const { data: { user } } = await auth.auth.getUser()
  if (!user?.email) redirect('/comunidad/entrar?next=%2Fcuestionario%3Forigen%3Dmetodo-tiroides')
  return <Cuestionario paidThyroidProgram initialEmail={user.email} />;
}
