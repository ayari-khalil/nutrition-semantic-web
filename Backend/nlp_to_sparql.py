import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# System prompt that teaches the LLM about your ontology
SYSTEM_PROMPT = """You are a SPARQL query generator for a nutrition and wellness ontology.

ONTOLOGY STRUCTURE:
Classes: Utilisateur, Aliment, Repas, Nutriment, Allergie, Préférence, ActivitéPhysique, 
         ObjectifSanté, Recette, PlanAlimentaire, Habitude, Recommandation

Key Properties:
- aAllergie: Utilisateur → Allergie
- aHabitude: Utilisateur → Habitude  
- aPréférence: Utilisateur → Préférence
- aObjectif: Utilisateur → ObjectifSanté
- pratique: Utilisateur → ActivitéPhysique
- contient: Repas → Aliment
- aNutriment: Aliment → Nutriment
- utilise: Recette → Aliment
- propose: PlanAlimentaire → Recette

Data Properties:
- aNom, aAge, aPoids, aTaille, sexe (Utilisateur)
- aCalories, aProtéines, aLipides, aGlucides (Aliment)
- aDurée, aIntensité (ActivitéPhysique)
- aTexte (Recommandation)

Base IRI: http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#

INSTRUCTIONS:
1. Convert natural language questions to SPARQL queries
2. Use PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
3. Return ONLY the SPARQL query, no explanations
4. Use SELECT queries for retrieving data
5. Use direct triple patterns, NOT FILTER clauses for matching resources
6. For matching specific resources (like :Proteines), use direct patterns like: ?aliment :aNutriment :Proteines
7. Use proper resource names without special characters when possible (Proteines not Protéines)
8. Always include the class type with 'a' when querying entities

EXAMPLES:

Question: "Quels sont tous les utilisateurs?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?user WHERE {
  ?user a :Utilisateur .
}

Question: "Quelles sont les allergies de Khalil?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?allergie WHERE {
  :Khalil :aAllergie ?allergie .
}

Question: "Qui est moetaz?" or "Informations sur moetaz"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT * WHERE {
  :moetaz ?p ?o .
}

Question: "Quel est l'âge de moetaz?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?age WHERE {
  :moetaz :aAge ?age .
}

Question: "Quels aliments contiennent des protéines?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?aliment WHERE {
  ?aliment a :Aliment ;
           :aNutriment :Proteines .
}

Question: "Quels sont tous les aliments?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?aliment WHERE {
  ?aliment a :Aliment .
}

Question: "Quel est le poids de Dhia?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?poids WHERE {
  :Dhia :aPoids ?poids .
}

Question: "Quels utilisateurs ont un objectif de perte de poids?"
SPARQL:
PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
SELECT ?user WHERE {
  ?user :aObjectif :PerteDePoids .
}

Now convert the user's question to SPARQL."""


def nl_to_sparql(question):
    """Convert natural language question to SPARQL query using Groq LLM"""
    
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
        print("ERROR: Groq API key not set! Please add it to backend/.env")
        return None
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",  # Updated model
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": question
            }
        ],
        "temperature": 0.1,
        "max_tokens": 500,
        "top_p": 1,
        "stream": False
    }
    
    try:
        print(f"Calling Groq API with model: {payload['model']}")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        # Print detailed error info
        if response.status_code != 200:
            print(f"Groq API Error: Status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
        response.raise_for_status()
        
        result = response.json()
        sparql_query = result['choices'][0]['message']['content'].strip()
        
        # Clean up the response (remove markdown code blocks if present)
        if sparql_query.startswith("```"):
            lines = sparql_query.split('\n')
            # Remove first and last line if they're markdown markers
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            sparql_query = '\n'.join(lines)
        
        return sparql_query.strip()
        
    except requests.exceptions.Timeout:
        print("Error: Request to Groq API timed out")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error calling Groq API: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response text: {e.response.text}")
        return None
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return None


def execute_sparql(sparql_query, fuseki_url):
    """Execute SPARQL query on Fuseki server"""
    
    headers = {
        "Content-Type": "application/sparql-query; charset=utf-8",
        "Accept": "application/json"
    }
    
    try:
        print(f"Executing SPARQL on Fuseki: {fuseki_url}")
        # Encode the query as UTF-8
        response = requests.post(
            fuseki_url, 
            data=sparql_query.encode('utf-8'), 
            headers=headers, 
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.Timeout:
        print("Error: Request to Fuseki timed out")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error executing SPARQL query: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Fuseki response: {e.response.text}")
        return None
    except Exception as e:
        print(f"Unexpected error executing SPARQL: {str(e)}")
        return None


def format_results(sparql_results):
    """Format SPARQL results into user-friendly format"""
    
    if not sparql_results or 'results' not in sparql_results:
        return []
    
    bindings = sparql_results['results']['bindings']
    
    if not bindings:
        return []
    
    # Extract variable names
    vars = sparql_results['head']['vars']
    
    # Format results
    formatted = []
    for binding in bindings:
        row = {}
        for var in vars:
            if var in binding:
                value = binding[var]['value']
                # Extract just the name from full URI
                if '#' in value:
                    value = value.split('#')[-1]
                row[var] = value
            else:
                row[var] = None
        formatted.append(row)
    
    return formatted