import "./globals.css";

export const metadata = {
  title: "Aplicativo de Receitas",
  description: "Gerencie suas receitas facilmente!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold hover:text-gray-200 transition">
              <a href="/">Aplicativo de Receitas</a>
            </h1>
            <a
              href="/recipes/new"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
            >
              Nova Receita
            </a>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4">{children}</main>

        <footer className="bg-gray-800 text-white text-center py-6 mt-8 shadow-inner">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} <span className="font-bold">Aplicativo de Receitas</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
