'use client';
import React, { useEffect, useState } from 'react';

type Recipe = {
  id: string;
  title: string;
  mealType: string;
};

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes');
        if (!response.ok) throw new Error('Erro ao buscar receitas');
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Erro ao carregar receitas:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-blue-500 text-xl">Carregando...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">Erro ao carregar as receitas.</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Aplicativo de Receitas</h1>
        <p className="text-center text-gray-600 mt-2">Explore nossas receitas e inspire-se!</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Receitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-800">{recipe.title}</h3>
              <p className="text-sm text-gray-600">Tipo: {recipe.mealType}</p>
              <a
                href={`/recipes/${recipe.id}`}
                className="mt-4 inline-block text-blue-500 hover:text-blue-700 hover:underline"
              >
                Ver receita
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
