from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_to_sparql import nl_to_sparql, execute_sparql, format_results
import os
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

FUSEKI_URL = os.getenv('FUSEKI_URL', 'http://localhost:3030/nutrition/sparql')


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        # Test Fuseki connection
        response = requests.get('http://localhost:3030/$/ping', timeout=5)
        fuseki_ok = response.status_code == 200
    except:
        fuseki_ok = False
    
    return jsonify({
        "status": "ok",
        "message": "API is running",
        "fuseki_status": fuseki_ok,
        "ai_status": True
    })


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
        sparql_results = execute_sparql_direct(sparql_query, FUSEKI_URL)
        
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
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e)
        }), 500


@app.route('/sparql', methods=['POST'])
def direct_sparql():
    """
    Direct SPARQL endpoint - returns raw Fuseki SPARQL JSON format
    """
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                "error": "Missing 'query' in request body"
            }), 400
        
        sparql_query = data['query']
        
        print(f"Executing SPARQL query:\n{sparql_query[:200]}...")
        
        # Execute SPARQL query and return raw results
        sparql_results = execute_sparql_direct(sparql_query, FUSEKI_URL)
        
        if sparql_results is None:
            return jsonify({
                "error": "Failed to execute SPARQL query on Fuseki"
            }), 500
        
        # Return raw SPARQL JSON format (has .results.bindings structure)
        return jsonify(sparql_results)
    
    except Exception as e:
        print(f"Error in /sparql endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e)
        }), 500


def execute_sparql_direct(sparql_query, fuseki_url):
    """
    Execute SPARQL query directly on Fuseki and return raw results
    """
    headers = {
        "Content-Type": "application/sparql-query",
        "Accept": "application/sparql-results+json"
    }
    
    try:
        print(f"Sending request to Fuseki: {fuseki_url}")
        response = requests.post(
            fuseki_url, 
            data=sparql_query.encode('utf-8'),
            headers=headers, 
            timeout=10
        )
        
        if response.status_code != 200:
            print(f"Fuseki error: {response.status_code}")
            print(f"Response: {response.text}")
            return None
        
        result = response.json()
        print(f"Fuseki returned {len(result.get('results', {}).get('bindings', []))} results")
        return result
    
    except requests.exceptions.Timeout:
        print("Error: Request to Fuseki timed out")
        return None
    except requests.exceptions.ConnectionError as e:
        print(f"Error: Cannot connect to Fuseki at {fuseki_url}")
        print(f"Details: {str(e)}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error executing SPARQL query: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Fuseki response: {e.response.text}")
        return None
    except Exception as e:
        print(f"Unexpected error executing SPARQL: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == '__main__':
    print("="*50)
    print("🚀 Nutrition AI API Starting...")
    print(f"📊 Fuseki URL: {FUSEKI_URL}")
    print("🌐 API will be available at: http://localhost:5000")
    print("="*50)
    
    # Test Fuseki connection on startup
    try:
        test_response = requests.get('http://localhost:3030/$/ping', timeout=5)
        if test_response.status_code == 200:
            print("✅ Fuseki server is reachable")
        else:
            print("⚠️  Fuseki server returned unexpected status")
    except Exception as e:
        print("❌ Cannot connect to Fuseki server!")
        print(f"   Error: {str(e)}")
        print("   Make sure Fuseki is running on http://localhost:3030")
    
    print("="*50)
    app.run(debug=True, port=5000)