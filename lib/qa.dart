  import 'dart:async';

  import 'package:flutter/material.dart';
  import 'package:performance/model/question.dart';

  import 'package:flutter/material.dart';
  import 'package:performance/model/question.dart';

  class QAPage extends StatefulWidget {
    final Question question;
    final Function(String) onNext;
    const QAPage({Key? key, required this.question, required this.onNext})
        : super(key: key);

    @override
    _QAPageState createState() => _QAPageState();
  }

  class _QAPageState extends State<QAPage> {
    final TextEditingController _controller =
        TextEditingController(); // Contrôleur pour le TextField

    Timer? _timer;
    int _remainingTime = 180; // 3 minutes en secondes

    @override
    void initState() {
      super.initState();
      // Démarre le timer lors de l'initialisation du widget
      _timer = Timer.periodic(Duration(seconds: 1), (Timer timer) {
        if (_remainingTime <= 0) {
          // Annuler le timer et appeler onNext lorsque le temps est écoulé
          setState(() {
            timer.cancel();
            widget.onNext(_controller.text);
          });
        } else {
          // Décrémenter le temps restant
          setState(() {
            _remainingTime--;
          });
        }
      });
    }

    @override
    void dispose() {
      // Annuler le timer si l'utilisateur quitte la page avant que le timer ne soit écoulé
      _timer?.cancel();
      _controller.dispose();
      super.dispose();
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
            decoration: BoxDecoration(color: Color(0xFFF4F2F6)),
            child: Stack(
              children: [
                Positioned(
                  left: -76,
                  top: -83,
                  child: Container(
                    width: 487,
                    height: 525,
                    child: Stack(
                      children: [
                        Positioned(
                          left: 76,
                          top: 80,
                          child: Container(
                            width: 411,
                            height: 445,
                            child: Stack(
                              children: [
                                Positioned(
                                  left: 0,
                                  top: 0,
                                  child: Container(
                                    width: 411,
                                    height: 445,
                                    decoration: ShapeDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment(0.00, -1.00),
                                        end: Alignment(0, 1),
                                        colors: [
                                          Color(0xFFDF0B0B),
                                          Color(0x00F6F1FB)
                                        ],
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
                                    height: 55.25,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment(0.00, -1.00),
                                        end: Alignment(0, 1),
                                        colors: [
                                          Color(0xFFDF0B0B),
                                          Color(0x00F6F1FB)
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 125,
                          top: 129,
                          child: Container(
                            width: 262,
                            height: 248,
                            decoration: ShapeDecoration(
                              color: Color(0x5BFB7D54),
                              shape: OvalBorder(),
                            ),
                          ),
                        ),
                        Positioned(
                          left: 154,
                          top: 155,
                          child: Container(
                            width: 204,
                            height: 196,
                            decoration: ShapeDecoration(
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
                          left: 180,
                          top: 181,
                          child: Container(
                            width: 152,
                            height: 144,
                            decoration: ShapeDecoration(
                              color: Colors.white,
                              shape: OvalBorder(),
                            ),
                          ),
                        ),
                        Positioned(
                          left: 361,
                          top: 108,
                          child: Container(
                            width: 52,
                            height: 52,
                            decoration: ShapeDecoration(
                              color: Color(0x5BFB7D54),
                              shape: OvalBorder(),
                            ),
                          ),
                        ),
                        Positioned(
                          left: 211,
                          top: 0,
                          child: Container(
                            width: 129,
                            height: 117,
                            decoration: ShapeDecoration(
                              color: Color(0x5BFB7D54),
                              shape: OvalBorder(),
                            ),
                          ),
                        ),
                        Positioned(
                          left: 211,
                          top: 208,
                          child: Container(
                            width: 90,
                            height: 90,
                            child: Image.asset(
                              'assets/qa.png',
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  left:
                      50, // Ajustez les valeurs en fonction de l'emplacement souhaité
                  top:
                      500, // Ajustez les valeurs en fonction de l'emplacement souhaité
                  child: Container(
                    width: 300,
                    // Définissez la largeur souhaitée pour le TextField
                    child: TextField(
                      controller: _controller,
                      maxLines: 5,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                        // Ajoutez des décorations supplémentaires selon vos besoins
                      ),
                      // Ajoutez d'autres propriétés à votre TextField si nécessaire
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
                          widget.onNext(_controller
                              .text); // L'appel est maintenant dans une fonction callback
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
                Positioned(
                  // Add the timer display somewhere suitable in your UI
                  left: 60,
                  top: 20, // Example position, adjust as needed
                  child: Text("Time remaining: $_remainingTime seconds",
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: const Color.fromARGB(255, 0, 0, 0))),
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
              ],
            ),
          ),
        ],
      );
    }
  }
