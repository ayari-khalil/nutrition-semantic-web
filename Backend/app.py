from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_to_sparql import nl_to_sparql, execute_sparql, format_results
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

FUSEKI_URL = os.getenv('FUSEKI_URL', 'http://localhost:3030/nutrition/sparql')


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "API is running"})


@app.route('/query', methods=['POST'])
def query():
    """
    Main endpoint: receives natural language question, 
    converts to SPARQL, executes, and returns results
    """
    try:
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({
                "error": "Missing 'question' in request body"
            }), 400
        
        question = data['question']
        
        # Step 1: Convert natural language to SPARQL
        print(f"Question: {question}")
        sparql_query = nl_to_sparql(question)
        
        if not sparql_query:
            return jsonify({
                "error": "Failed to generate SPARQL query"
            }), 500
        
        print(f"Generated SPARQL:\n{sparql_query}")
        
        # Step 2: Execute SPARQL query on Fuseki
        sparql_results = execute_sparql(sparql_query, FUSEKI_URL)
        
        if sparql_results is None:
            return jsonify({
                "error": "Failed to execute SPARQL query",
                "sparql": sparql_query
            }), 500
        
        # Step 3: Format results
        formatted_results = format_results(sparql_results)
        
        # Return everything
        return jsonify({
            "success": True,
            "question": question,
            "sparql": sparql_query,
            "results": formatted_results,
            "count": len(formatted_results)
        })
    
    except Exception as e:
        print(f"Error in /query endpoint: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 500


@app.route('/sparql', methods=['POST'])
def direct_sparql():
    """
    Direct SPARQL endpoint (for advanced users who want to write their own queries)
    """
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                "error": "Missing 'query' in request body"
            }), 400
        
        sparql_query = data['query']
        
        # Execute SPARQL query
        sparql_results = execute_sparql(sparql_query, FUSEKI_URL)
        
        if sparql_results is None:
            return jsonify({
                "error": "Failed to execute SPARQL query"
            }), 500
        
        # Format results
        formatted_results = format_results(sparql_results)
        
        return jsonify({
            "success": True,
            "results": formatted_results,
            "count": len(formatted_results)
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("="*50)
    print("🚀 Nutrition AI API Starting...")
    print(f"📊 Fuseki URL: {FUSEKI_URL}")
    print("🌐 API will be available at: http://localhost:5000")
    print("="*50)
    app.run(debug=True, port=5000)