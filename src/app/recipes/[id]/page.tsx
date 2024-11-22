'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Definição do tipo Recipe para os dados
type RecipeForm = {
  id?: string;
  title: string;
  mealType: string;
  servings: number;
  difficulty: string;
  ingredients: string | string[]; // Aceita string separada por vírgulas ou array de strings
  steps: string | string[]; // Aceita string separada por pontos ou array de strings
};

// Componente para edição de receitas
export default function EditRecipe({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<RecipeForm>({
    title: '',
    mealType: '',
    servings: 1,
    difficulty: '',
    ingredients: '',
    steps: '',
  });
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Função para normalizar dados que podem ser strings ou arrays
  function normalizeData(data: string | string[], delimiter: string): string[] {
    if (Array.isArray(data)) {
      return data.map((item) => item.trim());
    }
    return data.split(delimiter).map((item) => item.trim());
  }

  // Função de envio do formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      // Normalizar os ingredientes e etapas
      const normalizedIngredients = normalizeData(form.ingredients, ',');
      const normalizedSteps = normalizeData(form.steps, '.');

      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          ingredients: normalizedIngredients,
          steps: normalizedSteps,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar a receita.');
      }

      alert('Receita atualizada com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Função para manipular mudanças no formulário
  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Editar Receita</h1>

        {error && (
          <p className="text-red-500 mb-4">
            Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-bold mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="mealType" className="block font-bold mb-1">
              Tipo de Refeição
            </label>
            <input
              type="text"
              id="mealType"
              name="mealType"
              value={form.mealType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="servings" className="block font-bold mb-1">
              Porções
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={form.servings}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="difficulty" className="block font-bold mb-1">
              Dificuldade
            </label>
            <input
              type="text"
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ingredients" className="block font-bold mb-1">
              Ingredientes (separados por vírgulas)
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={form.ingredients as string}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="steps" className="block font-bold mb-1">
              Etapas (separadas por pontos)
            </label>
            <textarea
              id="steps"
              name="steps"
              value={form.steps as string}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
