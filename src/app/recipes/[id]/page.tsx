'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Recipe = {
  id?: string;
  title: string;
  mealType: string;
  servings: number;
  difficulty: string;
  ingredients: string | string[]; // Pode ser uma string ou um array
  steps: string | string[]; // Pode ser uma string ou um array
};

export default function RecipeDetails({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!params.id) {
      console.error('ID da receita não foi fornecido!');
      setError(true);
      setLoading(false);
      return;
    }

    async function fetchRecipe() {
      try {
        const response = await fetch(
          `https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`Erro ao buscar a receita com ID: ${params.id}`);
        }
        const data: Recipe = await response.json();
        setRecipe(data);
      } catch (err) {
        console.error('Erro ao carregar a receita:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [params.id]);

  async function handleDelete() {
    if (!window.confirm('Tem certeza de que deseja excluir esta receita?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes/${params.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Erro ao excluir a receita');
      }

      alert('Receita excluída com sucesso!');
      router.push('/');
    } catch (err) {
      console.error('Erro ao excluir receita:', err);
      alert('Erro ao excluir a receita. Por favor, tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }

  function normalizeArray(data: string | string[], delimiter: string): string[] {
    if (Array.isArray(data)) {
      return data.map((item) => item.trim());
    }
    return data.split(delimiter).map((item) => item.trim());
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-blue-500 text-xl">Carregando...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-red-500 text-2xl font-bold">Erro ao carregar os detalhes da receita.</h1>
        <p className="text-gray-600 mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  const ingredients = normalizeArray(recipe.ingredients, ',');
  const steps = normalizeArray(recipe.steps, '.');

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{recipe.title}</h1>
        <div className="mb-4">
          <p className="text-gray-600">
            <strong>Tipo:</strong> {recipe.mealType}
          </p>
          <p className="text-gray-600">
            <strong>Serve:</strong> {recipe.servings} pessoas
          </p>
          <p className="text-gray-600">
            <strong>Dificuldade:</strong> {recipe.difficulty}
          </p>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Ingredientes</h2>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="mb-1">
              {ingredient}
            </li>
          ))}
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Etapas</h2>
        <ol className="list-decimal pl-6 mt-2 text-gray-700">
          {steps.map((step, index) => (
            <li key={index} className="mb-2">
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleDelete}
            className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Receita'}
          </button>
          <button
            onClick={() => router.push(`/recipes/edit/${recipe.id}`)}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
          >
            Editar Receita
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Voltar para a Lista
          </button>
        </div>
      </div>
    </div>
  );
}
