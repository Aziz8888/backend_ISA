from flask import Flask, request, jsonify
import sys
import json
import google.generativeai as genai

app = Flask(__name__)

genai.configure(api_key='AIzaSyD6lQ21fgJlrWTPhr_BWYpM9_MDf6IV9Y0')

def poser_question(data):
    try:
        question = data['question']
        reponse_attendue = data['reponse_attendue']
        mots_cles = data['mots_cles']
        note_totale = data['note_totale']

        model = genai.GenerativeModel('gemini-pro')
        reponse_generee = model.generate_content(question).text

        # Split the expected and generated responses into lowercase words
        reponse_attendue_parts = reponse_attendue.lower().split()
        reponse_generee_parts = reponse_generee.lower().split()

        # Compare the words and find the correct part of the response
        partie_correcte = []
        i = 0
        for word in reponse_generee_parts:
            if i < len(reponse_attendue_parts) and word in reponse_attendue.lower():
                partie_correcte.append(word)
                i += 1

        # Calculate the score based on the keywords
        note_obtenue = 0
        if partie_correcte:
            partie_correcte_str = ' '.join(partie_correcte)
            for mot_cle in mots_cles:
                if mot_cle.strip().lower() in partie_correcte_str:
                    note_obtenue += note_totale / len(mots_cles)
        else:
            partie_correcte_str = "La réponse est incorrecte."

        result = {
            "partie_correcte": partie_correcte_str,
            "note_obtenue": round(note_obtenue, 2)
        }
        return jsonify(result)
    except Exception as e:
        return "Erreur lors du traitement de la question: " + str(e)

@app.route('/poser_question', methods=['POST'])
def handle_question():
    try:
        data = request.json
        return poser_question(data)
    except Exception as e:
        return "Erreur lors de la lecture des données en entrée: " + str(e)

if __name__ == "__main__":
    app.run(port=9090)
