
import sys
import json
import google.generativeai as genai

genai.configure(api_key='AIzaSyD6lQ21fgJlrWTPhr_BWYpM9_MDf6IV9Y0')

def poser_question(data):
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
        print(f"La partie correcte de la réponse est : {' '.join(partie_correcte)}")
        for mot_cle in mots_cles:
            if mot_cle.strip().lower() in ' '.join(partie_correcte):
                note_obtenue += note_totale / len(mots_cles)
    else:
        print("La réponse est incorrecte.")

    print(f"Note obtenue : {round(note_obtenue, 2)}")

if __name__ == "__main__":
    
    data = json.load(sys.stdin)
    poser_question(data)
