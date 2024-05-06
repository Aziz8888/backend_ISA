import 'package:flutter/material.dart';
import 'package:performance/model/question.dart'; // Assurez-vous que le chemin d'accès est correct.
import 'dart:async';

class Quiz extends StatefulWidget {
  final Question question;
  final Function(String) onNext;

  const Quiz({Key? key, required this.question, required this.onNext})
      : super(key: key);

  @override
  _QuizState createState() => _QuizState();
}

class _QuizState extends State<Quiz> {
  Map<String, Color> buttonColors = {};
  Timer? _timer;
  int _remainingTime = 180;
  List<String> options = [];
  String selectedAnswer = "";
  @override
  void initState() {
    super.initState();
    if (widget.question.options != null) {
      options = widget.question.options!;
    }
    // Initialiser les couleurs des boutons à blanc pour toutes les options si elles existent

    startTimer();
  }

  void startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_remainingTime > 0) {
        setState(() {
          _remainingTime--;
        });
      } else {
        _timer?.cancel();
        widget.onNext(
            selectedAnswer); // Passer automatiquement à la prochaine question lorsque le temps est écoulé
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Widget _buildChoiceButton(BuildContext context, String choice) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 10),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: buttonColors[
              choice], // Utilisez la couleur du Map pour chaque bouton
          onPrimary: Colors.black,
          textStyle: const TextStyle(fontSize: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          minimumSize: const Size(double.infinity, 50),
        ),
        onPressed: () {
          // Mettre à jour l'état du bouton pour montrer qu'il est sélectionné
          setState(() {
            // Réinitialiser toutes les couleurs à la couleur initiale
            buttonColors.forEach((key, value) {
              buttonColors[key] =
                  Colors.white; // ou autre couleur de fond par défaut
            });

            // Définir la couleur du bouton sélectionné pour le mettre en évidence
            buttonColors[choice] = Colors.blue;
            selectedAnswer =
                choice; // Utilisez une couleur pour indiquer la sélection
          });

          // Optionnel: Exécutez le onNext après un délai, ou attendez une action de l'utilisateur
          // Future.delayed(Duration(seconds: 1), () {
          //   widget.onNext();  // Passer à la question suivante après un court délai
          // });
        },
        child: Text(choice),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
    return Column(
      children: [
        Container(
          width: 411,
          height: screenHeight * 0.88,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(color: const Color(0xFFF4F2F6)),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                top: -3,
                child: Container(
                  width: 411,
                  height: 872,
                  child: Stack(
                    children: [
                      Positioned(
                        left: 0,
                        top: 0,
                        child: Container(
                          width: 411,
                          height: 872,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDF0B0B), Color(0x00F6F1FB)],
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18),
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 0,
                        top: 0,
                        child: Container(
                          width: 411,
                          height: 108.27,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDF0B0B), Color(0x00F6F1FB)],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: 49,
                top: 46,
                child: Container(
                  width: 262,
                  height: 248,
                  decoration: const ShapeDecoration(
                    color: Color(0x5BFB7D54),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 78,
                top: 72,
                child: Container(
                  width: 204,
                  height: 196,
                  decoration: const ShapeDecoration(
                    gradient: LinearGradient(
                      begin: Alignment(0.00, -1.00),
                      end: Alignment(0, 1),
                      colors: [Color(0xFFE96868), Color(0x00FCA8A8)],
                    ),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 104,
                top: 98,
                child: ClipOval(
                  child: Container(
                    width: 152,
                    height: 144,
                    color: Colors.white,
                    child: Center(
                      child: Container(
                        width: 100,
                        height: 100,
                        child: Image.asset(
                          'assets/quizz.png',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 285,
                top: 25,
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: const ShapeDecoration(
                    color: Color(0x5BFB7D54),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 6,
                top: 8,
                child: Container(
                  width: 129,
                  height: 117,
                  decoration: const ShapeDecoration(
                    color: Color(0x5BFB7D54),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 40,
                top: 300,
                child: Container(
                  width: 316,
                  decoration: const ShapeDecoration(
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(14)),
                    ),
                    shadows: [
                      BoxShadow(
                        color: Color(0x3F9D57E3),
                        blurRadius: 13,
                        offset: Offset(0, 2),
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      "Question: ${widget.question.question ?? 'Pas de question fournie.'}\n"
                      "Complexité: ${widget.question.complexity?.toString() ?? 'Non spécifiée'} | "
                      "Points possibles: ${widget.question.marks?.toString() ?? '0'}",
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                left:
                    60, // Adjust these values to position the timer within your UI
                top: 20,
                child: SizedBox(
                  width: 120,
                  height: 120,
                  child: Stack(
                    alignment: Alignment.center,
                    children: <Widget>[
                      CircularProgressIndicator(
                        value: _remainingTime /
                            60.0, // Assuming 60 seconds total time
                        strokeWidth: 10,
                        backgroundColor: Colors.grey[300],
                        color: Colors.blue,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.red),
                      ),
                      Text(
                        "$_remainingTime seconds",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: 40,
                top: 400,
                child: SizedBox(
                  width: 316,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: options
                        .map((choice) => _buildChoiceButton(context, choice))
                        .toList(),
                  ),
                ),
              ),
              Positioned(
                left: 120,
                top: 700,
                child: Transform(
                  transform: Matrix4.identity()
                    ..translate(0.0, 0.0)
                    ..rotateZ(-0.03),
                  child: SizedBox(
                    width: 150,
                    height: 45,
                    child: ElevatedButton(
                      onPressed: () {
                        widget.onNext(
                            selectedAnswer); // L'appel est maintenant dans une fonction callback
                      },
                      style: ElevatedButton.styleFrom(
                        primary: Color(0xFFFFF9F9), // Fond du bouton
                        onPrimary: Colors.black, // Couleur du texte
                        textStyle: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.w500,
                          fontSize: 25,
                        ),
                      ),
                      child: Text('Next', textAlign: TextAlign.center),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
