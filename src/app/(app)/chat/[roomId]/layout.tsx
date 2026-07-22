export default async function Page({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  return <div className="flex">{children}</div>;
}

