export default function NotesFilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div hidden>{sidebar}</div>
    </>
  );
}
