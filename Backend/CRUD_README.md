# 🎯 CRUD Backend - Implémentation Complète

## ✅ Fichiers Créés (Backend)

### 1. **Models** (`models.py`)

- Classes Python pour User, Diet, Nutrient, Food
- Méthodes `to_dict()` pour sérialisation
- Dataclasses avec types optionnels

### 2. **Validators** (`validators.py`)

- Schémas Pydantic pour validation des données
- UserSchema, DietSchema, NutrientSchema, FoodSchema
- Schémas de mise à jour (UpdateSchema) pour chaque entité
- Validation email, age, types, etc.

### 3. **SPARQL Builder** (`services/sparql_builder.py`)

- Génération automatique de requêtes SPARQL
- Méthodes INSERT, SELECT, UPDATE, DELETE, COUNT, SEARCH
- Gestion des namespaces et échappement de caractères
- Génération d'IDs uniques et timestamps

### 4. **CRUD Service** (`services/crud_service.py`)

- Logique métier complète CRUD
- Connexion avec Apache Jena Fuseki
- Méthodes pour toutes les entités:
  - create_user/diet/nutrient/food
  - get_user/diet/nutrient/food
  - list_users/diets/nutrients/foods (avec pagination)
  - update_user/diet/nutrient/food
  - delete_user/diet/nutrient/food
  - count_users/diets/nutrients/foods
- Parsing des résultats SPARQL
- Gestion des propriétés arrays

### 5. **Routes API** (`routes/crud_routes.py`)

- 20 endpoints RESTful organisés par entité
- Validation automatique avec Pydantic
- Gestion d'erreurs robuste
- Pagination, recherche, statistiques

## 🔌 API Endpoints Disponibles

### **Users**

```
POST   /api/users          - Créer un utilisateur
GET    /api/users          - Lister (pagination + search)
GET    /api/users/:id      - Obtenir un utilisateur
PUT    /api/users/:id      - Mettre à jour
DELETE /api/users/:id      - Supprimer
```

### **Diets**

```
POST   /api/diets          - Créer un régime
GET    /api/diets          - Lister (pagination + search)
GET    /api/diets/:id      - Obtenir un régime
PUT    /api/diets/:id      - Mettre à jour
DELETE /api/diets/:id      - Supprimer
```

### **Nutrients**

```
POST   /api/nutrients      - Créer un nutriment
GET    /api/nutrients      - Lister (pagination + search)
GET    /api/nutrients/:id  - Obtenir un nutriment
PUT    /api/nutrients/:id  - Mettre à jour
DELETE /api/nutrients/:id  - Supprimer
```

### **Foods**

```
POST   /api/foods          - Créer un aliment
GET    /api/foods          - Lister (pagination + search)
GET    /api/foods/:id      - Obtenir un aliment
PUT    /api/foods/:id      - Mettre à jour
DELETE /api/foods/:id      - Supprimer
```

### **Stats**

```
GET    /api/stats          - Obtenir statistiques globales
```

## 📦 Dépendances Ajoutées

```txt
pydantic==2.5.0          # Validation des données
pydantic[email]          # Support validation email
groq==0.4.0             # API Groq (déjà présent)
```

## 🚀 Comment Démarrer

### 1. Installer les dépendances

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Configurer `.env`

```env
FUSEKI_URL=http://localhost:3030/nutrition/sparql
FUSEKI_UPDATE_URL=http://localhost:3030/nutrition/update
GROQ_API_KEY=your_groq_api_key
```

### 3. Démarrer le serveur

```bash
python app.py
```

Le serveur démarre sur **http://localhost:5000**

## 📝 Exemples d'Utilisation

### Créer un Utilisateur

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "gender": "Male",
    "diet_type": "Végétarien",
    "allergies": ["Gluten"],
    "preferences": ["Bio"]
  }'
```

### Lister les Utilisateurs

```bash
curl http://localhost:5000/api/users?limit=10&offset=0&search=John
```

### Créer un Aliment

```bash
curl -X POST http://localhost:5000/api/foods \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Banane",
    "category": "Fruit",
    "calories": 89.0,
    "proteins": 1.1,
    "carbohydrates": 22.8,
    "fats": 0.3,
    "fiber": 2.6
  }'
```

## 🎯 Prochaines Étapes

### Phase 2: Frontend (à venir)

1. ✅ Types TypeScript
2. ✅ Services CRUD
3. ✅ Composants UI réutilisables
4. ✅ Pages CRUD complètes
5. ✅ Navigation et routing

## 📊 Architecture

```
Backend/
├── app.py                          # Application Flask principale
├── models.py                       # Modèles de données
├── validators.py                   # Schémas de validation
├── requirements.txt                # Dépendances
├── services/
│   ├── __init__.py
│   ├── sparql_builder.py          # Construction requêtes SPARQL
│   └── crud_service.py            # Logique CRUD
└── routes/
    ├── __init__.py
    └── crud_routes.py             # Endpoints REST API
```

## ✨ Fonctionnalités

✅ CRUD complet pour 4 entités  
✅ Validation robuste avec Pydantic  
✅ Pagination et recherche  
✅ Gestion d'erreurs complète  
✅ Code simple et lisible  
✅ Respect des best practices Flask  
✅ RESTful API standard  
✅ Intégration avec triple store RDF

## 🔧 Tests Recommandés

Utilisez **Postman** ou **Thunder Client** (VS Code) pour tester les endpoints:

1. Créer quelques utilisateurs
2. Lister et rechercher
3. Mettre à jour un utilisateur
4. Supprimer un utilisateur
5. Répéter pour diets, nutrients, foods
6. Vérifier les statistiques

---

**Backend CRUD est maintenant prêt ! 🎉**

Prêt pour passer au Frontend ?
