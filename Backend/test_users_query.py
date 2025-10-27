"""
Test script to verify Users query works with actual Fuseki data
"""
import requests
import json

# Test the Users list endpoint
def test_users_list():
    url = "http://localhost:5000/api/users"
    
    print("Testing Users List Query...")
    print(f"Requesting: {url}\n")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS! Got response:")
            print(json.dumps(data, indent=2))
            
            if data.get('items'):
                print(f"\n📊 Found {len(data['items'])} users:")
                for user in data['items']:
                    print(f"  - {user.get('name', user['id'])}: {user}")
            else:
                print("\n⚠️  No users found in response")
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")

# Test the Users count endpoint
def test_users_count():
    url = "http://localhost:5000/api/users/count"
    
    print("\n" + "="*60)
    print("Testing Users Count Query...")
    print(f"Requesting: {url}\n")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS! Count: {data}")
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")

# Test direct SPARQL query
def test_direct_sparql():
    fuseki_url = "http://localhost:3031/nutrition/sparql"
    
    query = """PREFIX : <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>

SELECT DISTINCT ?id ?name ?age ?weight ?height ?gender
WHERE {
    ?id a :Utilisateur .
    OPTIONAL { ?id :aNom ?name }
    OPTIONAL { ?id :aAge ?age }
    OPTIONAL { ?id :aPoids ?weight }
    OPTIONAL { ?id :aTaille ?height }
    OPTIONAL { ?id :sexe ?gender }
}
ORDER BY ?name
LIMIT 100
"""
    
    print("\n" + "="*60)
    print("Testing Direct SPARQL Query to Fuseki...")
    print(f"Requesting: {fuseki_url}\n")
    
    try:
        response = requests.post(
            fuseki_url,
            data={'query': query},
            headers={'Accept': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            bindings = data.get('results', {}).get('bindings', [])
            print(f"\n✅ SUCCESS! Found {len(bindings)} users:")
            print(json.dumps(bindings, indent=2))
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")

if __name__ == "__main__":
    print("="*60)
    print("CRUD USERS QUERY TEST")
    print("="*60 + "\n")
    
    # First test direct SPARQL to verify Fuseki has data
    test_direct_sparql()
    
    # Then test the Flask API endpoints
    test_users_count()
    test_users_list()
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)
