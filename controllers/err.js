const axios = require('axios');

// Configurez votre clé API
const apiKey = 'AIzaSyD6lQ21fgJlrWTPhr_BWYpM9_MDf6IV9Y0';
const apiUrl = 'https://api.generativeai.com/gemini-pro';

const poserQuestion = async () => {
  try {
    const question = prompt("Entrez votre question : ");
    const reponseAttendue = prompt("Entrez la réponse attendue : ");
    const motsCles = prompt("Entrez les mots-clés (séparés par des virgules) : ").split(',');
    const noteTotale = parseFloat(prompt("Entrez la note totale : "));

    // Faites une demande à l'API générative
    const response = await axios.post(apiUrl, {
      question: question,
      apiKey: apiKey
    });

    const reponseGeneree = response.data.text;

    // Divisez les réponses attendues et générées en mots en minuscules
    const reponseAttendueParts = reponseAttendue.toLowerCase().split(' ');
    const reponseGenereeParts = reponseGeneree.toLowerCase().split(' ');

    // Comparez les mots et trouvez la partie correcte de la réponse
    let partieCorrecte = [];
    let i = 0;
    for (let word of reponseGenereeParts) {
      if (i < reponseAttendueParts.length && reponseAttendue.toLowerCase().includes(word)) {
        partieCorrecte.push(word);
        i++;
      }
    }

    // Calculez la note en fonction des mots-clés
    let noteObtenue = 0;
    if (partieCorrecte.length > 0) {
      console.log(`La partie correcte de la réponse est : ${partieCorrecte.join(' ')}`);
      for (let motCle of motsCles) {
        if (partieCorrecte.join(' ').includes(motCle.trim().toLowerCase())) {
          noteObtenue += noteTotale / motsCles.length;
        }
      }
    } else {
      console.log("La réponse est incorrecte.");
    }

    console.log(`Note obtenue : ${noteObtenue.toFixed(2)}`);
  } catch (error) {
    console.error(`Erreur : ${error}`);
  }
};

// Appel de la fonction
poserQuestion();
