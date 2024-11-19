"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Recipe = {
  id?: string;
  title: string;
  mealType: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  steps: string[];
};

export default function EditRecipe({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<Recipe>({
    title: "",
    mealType: "",
    servings: 0,
    difficulty: "",
    ingredients: [],
    steps: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    mealType: "",
    servings: "",
    difficulty: "",
    ingredients: "",
    steps: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Validação do formulário
  function validateForm() {
    let valid = true;
    const newErrors = { title: "", mealType: "", servings: "", difficulty: "", ingredients: "", steps: "" };

    if (!form.title) {
      newErrors.title = "O título é obrigatório.";
      valid = false;
    }
    if (!form.mealType) {
      newErrors.mealType = "O tipo de refeição é obrigatório.";
      valid = false;
    }
    if (form.servings <= 0) {
      newErrors.servings = "O número de porções deve ser maior que zero.";
      valid = false;
    }
    if (!form.difficulty) {
      newErrors.difficulty = "O nível de dificuldade é obrigatório.";
      valid = false;
    }
    if (form.ingredients.length === 0) {
      newErrors.ingredients = "Os ingredientes são obrigatórios.";
      valid = false;
    }
    if (form.steps.length === 0) {
      newErrors.steps = "As etapas são obrigatórias.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  // Carregar os dados da receita para edição
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(
          `https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`Erro ao carregar a receita com ID: ${params.id}`);
        }
        const data = await response.json();
        setForm({
          ...data,
          ingredients: data.ingredients.join(", "),
          steps: data.steps.join(". "),
        });
      } catch (err) {
        console.error("Erro ao carregar a receita:", err);
        alert("Erro ao carregar os dados da receita.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [params.id]);

  // Submeter o formulário de edição
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const ingredientsArray = form.ingredients.split(",").map((item) => item.trim());
      const stepsArray = form.steps.split(".").map((step) => step.trim());

      const response = await fetch(
        `https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, ingredients: ingredientsArray, steps: stepsArray }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar as alterações");
      }

      alert("Receita atualizada com sucesso!");
      router.push(`/recipes/${params.id}`);
    } catch (err) {
      console.error("Erro ao salvar a receita:", err);
      alert("Erro ao salvar as alterações da receita.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-blue-500 text-xl">Carregando dados da receita...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Editar Receita</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Título:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`border rounded p-3 w-full ${errors.title ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Tipo de Refeição */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tipo de Refeição:</label>
            <input
              type="text"
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              className={`border rounded p-3 w-full ${errors.mealType ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.mealType && <p className="text-red-500 text-sm mt-1">{errors.mealType}</p>}
          </div>

          {/* Serve Quantas Pessoas */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Serve Quantas Pessoas:</label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
              className={`border rounded p-3 w-full ${errors.servings ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
          </div>

          {/* Ingredientes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Ingredientes (separados por vírgula):</label>
            <textarea
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              className={`border rounded p-3 w-full ${errors.ingredients ? "border-red-500" : "border-gray-300"}`}
              required
            ></textarea>
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          {/* Etapas */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Etapas (separadas por ponto final):</label>
            <textarea
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
              className={`border rounded p-3 w-full ${errors.steps ? "border-red-500" : "border-gray-300"}`}
              required
            ></textarea>
            {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </main>
  );
}
