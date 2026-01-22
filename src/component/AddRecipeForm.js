import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/AddRecipeForm.css';

const AddRecipeForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    ingredients: [''],
    steps: [''],
    prepTime: '',
    cookTime: '',
    category: 'Plat',
    servings: '',
    visibility: 'Public'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is authenticated and is a chef
    const currentUser = UserService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'chef') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.image) {
      newErrors.image = 'Une image est obligatoire';
    }

    if (formData.ingredients.filter(ing => ing.trim()).length === 0) {
      newErrors.ingredients = 'Au moins un ingrédient est requis';
    }

    if (formData.steps.filter(step => step.trim()).length === 0) {
      newErrors.steps = 'Au moins une étape est requise';
    }

    if (!formData.prepTime || formData.prepTime <= 0) {
      newErrors.prepTime = 'Temps de préparation invalide';
    }

    if (!formData.cookTime || formData.cookTime < 0) {
      newErrors.cookTime = 'Temps de cuisson invalide';
    }

    if (!formData.servings || formData.servings <= 0) {
      newErrors.servings = 'Nombre de portions invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        steps: newSteps
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Format d\'image non supporté (JPG, PNG, WEBP uniquement)'
        }));
        return;
      }

      // Validate file size (3MB max)
      if (file.size > 3 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'L\'image ne doit pas dépasser 3MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Clear error if validation passes
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would:
      // 1. Upload image to storage and get URL
      // 2. Send recipe data to API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, just show success
      setSuccessMessage('✅ Recette ajoutée avec succès!');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: '',
          image: null,
          ingredients: [''],
          steps: [''],
          prepTime: '',
          cookTime: '',
          category: 'Plat',
          servings: '',
          visibility: 'Public'
        });
        setSuccessMessage('');
        // Navigate back to dashboard or recipe list
        navigate('/dashboard/chef');
      }, 2000);

    } catch (error) {
      console.error('Error submitting recipe:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout de la recette' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/chef');
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-container">
        <div className="form-header">
          <h1>Ajouter une nouvelle recette</h1>
          <p>Partagez votre expertise culinaire avec la communauté HomeFlavors</p>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form className="recipe-form" onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Titre de la recette *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Entrez le nom de votre recette"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Image de la recette *</label>
            <input
              type="file"
              id="image"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageUpload}
              className={errors.image ? 'error' : ''}
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
            {formData.image && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(formData.image)} 
                  alt="Preview" 
                />
                <p>{formData.image.name}</p>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label>Ingrédients *</label>
            <div className="ingredients-list">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingrédient ${index + 1}`}
                    className={errors.ingredients ? 'error' : ''}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="add-btn"
              >
                + Ajouter un ingrédient
              </button>
            </div>
            {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
          </div>

          {/* Steps */}
          <div className="form-group">
            <label>Étapes de préparation *</label>
            <div className="steps-list">
              {formData.steps.map((step, index) => (
                <div key={index} className="step-input">
                  <div className="step-number">Étape {index + 1}</div>
                  <textarea
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Décrivez l'étape ${index + 1}`}
                    rows="3"
                    className={errors.steps ? 'error' : ''}
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="add-btn"
              >
                + Ajouter une étape
              </button>
            </div>
            {errors.steps && <span className="error-message">{errors.steps}</span>}
          </div>

          {/* Prep Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Temps de préparation (min) *</label>
              <input
                type="number"
                id="prepTime"
                value={formData.prepTime}
                onChange={(e) => handleInputChange('prepTime', e.target.value)}
                className={errors.prepTime ? 'error' : ''}
                min="1"
              />
              {errors.prepTime && <span className="error-message">{errors.prepTime}</span>}
            </div>

            {/* Cook Time */}
            <div className="form-group">
              <label htmlFor="cookTime">Temps de cuisson (min)</label>
              <input
                type="number"
                id="cookTime"
                value={formData.cookTime}
                onChange={(e) => handleInputChange('cookTime', e.target.value)}
                className={errors.cookTime ? 'error' : ''}
                min="0"
              />
              {errors.cookTime && <span className="error-message">{errors.cookTime}</span>}
            </div>
          </div>

          {/* Servings */}
          <div className="form-group">
            <label htmlFor="servings">Portions *</label>
            <input
              type="number"
              id="servings"
              value={formData.servings}
              onChange={(e) => handleInputChange('servings', e.target.value)}
              className={errors.servings ? 'error' : ''}
              min="1"
            />
            {errors.servings && <span className="error-message">{errors.servings}</span>}
          </div>

          {/* Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="Entrée">Entrée</option>
                <option value="Plat">Plat</option>
                <option value="Dessert">Dessert</option>
                <option value="Vegan">Vegan</option>
                <option value="Végétarien">Végétarien</option>
                <option value="Sans gluten">Sans gluten</option>
              </select>
            </div>

            {/* Visibility */}
            <div className="form-group">
              <label htmlFor="visibility">Visibilité</label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
              >
                <option value="Public">Public</option>
                <option value="Privé">Privé</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRecipeForm;