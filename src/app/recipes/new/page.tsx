"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipe() {
  const [form, setForm] = useState({
    title: "",
    mealType: "",
    servings: 0,
    difficulty: "",
    ingredients: "",
    steps: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    mealType: "",
    servings: "",
    difficulty: "",
    ingredients: "",
    steps: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

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
    if (!form.ingredients) {
      newErrors.ingredients = "Os ingredientes são obrigatórios.";
      valid = false;
    }
    if (!form.steps) {
      newErrors.steps = "As etapas são obrigatórias.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const ingredientsArray = form.ingredients.split(",").map((item) => item.trim());
      const stepsArray = form.steps.split(".").map((step) => step.trim());
      await fetch("https://673bc1ca96b8dcd5f3f75bb6.mockapi.io/api/v1/recipes/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, ingredients: ingredientsArray, steps: stepsArray }),
      });
      setForm({ title: "", mealType: "", servings: 0, difficulty: "", ingredients: "", steps: "" });
      router.push("/");
    } catch (err) {
      console.error("Erro ao cadastrar receita:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Cadastrar Nova Receita</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Título:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`border rounded p-3 w-full ${errors.title ? "border-red-500" : "border-gray-300"}`}
              placeholder="Digite o título da receita"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tipo de Refeição:</label>
            <input
              type="text"
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              className={`border rounded p-3 w-full ${errors.mealType ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ex.: Café da manhã, Almoço"
            />
            {errors.mealType && <p className="text-red-500 text-sm mt-1">{errors.mealType}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Serve Quantas Pessoas:</label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
              className={`border rounded p-3 w-full ${errors.servings ? "border-red-500" : "border-gray-300"}`}
              placeholder="Digite o número de porções"
            />
            {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nível de Dificuldade:</label>
            <input
              type="text"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className={`border rounded p-3 w-full ${errors.difficulty ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ex.: Fácil, Médio, Difícil"
            />
            {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Ingredientes (separados por vírgula):</label>
            <textarea
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              className={`border rounded p-3 w-full ${errors.ingredients ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ex.: 2 ovos, 1 xícara de leite"
            ></textarea>
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Etapas (separadas por ponto final):</label>
            <textarea
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
              className={`border rounded p-3 w-full ${errors.steps ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ex.: Misture tudo. Asse no forno."
            ></textarea>
            {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Receita"}
          </button>
        </form>
      </div>
    </main>
  );
}
