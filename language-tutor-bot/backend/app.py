import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend calls

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt (bot acts like a language tutor)
SYSTEM_PROMPT = """
You are a friendly native speaker language tutor.
Your role:
- Hold simple, natural conversations with the user.
- If the user makes mistakes, gently correct grammar and vocabulary.
- Provide explanations in simple terms, not too long.
- Encourage the learner with short feedback.
"""

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        if not user_message.strip():
            return jsonify({"response": "Please say something to start chatting!"})

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",   # Small, fast model for chat
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )

        ai_reply = response.choices[0].message.content
        return jsonify({"response": ai_reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
