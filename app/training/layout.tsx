/** /training/* は認証・Supabase 依存のため静的生成しない */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
