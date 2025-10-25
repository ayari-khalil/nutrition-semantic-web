import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')

print("="*50)
print("Testing Groq API Connection")
print("="*50)
print(f"API Key: {GROQ_API_KEY[:20]}..." if GROQ_API_KEY else "API Key: NOT SET")
print()

if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
    print("❌ ERROR: Groq API key not set!")
    print("Please add your key to backend/.env")
    exit(1)

# Test simple request
url = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama-3.3-70b-versatile",  # Updated model
    "messages": [
        {
            "role": "user",
            "content": "Say hello in one word"
        }
    ],
    "temperature": 0.5,
    "max_tokens": 10
}

try:
    print("Sending test request to Groq...")
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        message = result['choices'][0]['message']['content']
        print(f"✅ SUCCESS! Groq responded: {message}")
        print("\nYour API key is working correctly!")
    else:
        print(f"❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        print("\nPossible issues:")
        print("1. Invalid API key")
        print("2. API key expired")
        print("3. Rate limit exceeded")
        print("4. Check your account at https://console.groq.com/")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    print("\nPlease check:")
    print("1. Internet connection")
    print("2. API key is correct")
    print("3. Groq service is available")

print("="*50)