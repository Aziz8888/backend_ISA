import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:performance/performance.dart';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // For using jsonDecode

class ResultQuiz extends StatefulWidget {
  final String studentId;
  final String testId;

  ResultQuiz({Key? key, required this.studentId, required this.testId}) : super(key: key);

  @override
  _ResultQuizState createState() => _ResultQuizState();
}

class _ResultQuizState extends State<ResultQuiz> {
  late Future<String> _totalScore;

  Future<String> fetchTotalScore() async {
    var url = Uri.parse(
        'http://10.0.2.2:50689/note/totales/${widget.testId}/${widget.studentId}');

    try {
      var response = await http.get(url);
      if (response.statusCode == 200) {
        var jsonResponse = jsonDecode(response.body);
        return jsonResponse['totalScore'].toString(); // Assuming 'totalScore' is the key in the JSON response
      } else {
        return 'Request failed with status: ${response.statusCode}.';
      }
    } catch (e) {
      return 'Error occurred: $e';
    }
  }

  @override
  void initState() {
    super.initState();
    _totalScore = fetchTotalScore(); // Load the score when the widget is built
  }

  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Column(
      children: [
        Container(
          width: screenWidth,
          height: screenHeight,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(color: Color(0xFFF4F2F6)),
          child: Stack(
            children: [
              Positioned(
                left: -37,
                top: -80,
                child: Container(
                  width: 573,
                  height: 961,
                  child: Stack(
                    children: [
                      Positioned(
                        left: 37,
                        top: 80,
                        child: Container(
                          width: 411,
                          height: 881,
                          child: Stack(
                            children: [
                              Positioned(
                                left: 0,
                                top: 0,
                                child: Container(
                                  width: 411,
                                  height: 881,
                                  decoration: ShapeDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment(0.00, -1.00),
                                      end: Alignment(0, 1),
                                      colors: [
                                        Color(0xFFFABFBF),
                                        Color(0x00FBF5F5)
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
                                  height: 56,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment(0.00, -1.00),
                                      end: Alignment(0, 1),
                                      colors: [
                                        Color(0xFFFABFBF),
                                        Color(0x00FBF5F5)
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
                        left: 0,
                        top: 97,
                        child: Container(
                          width: 262,
                          height: 248,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDA3838), Color(0x00C7A8FC)],
                            ),
                            shape: OvalBorder(),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 29,
                        top: 123,
                        child: Container(
                          width: 204,
                          height: 196,
                          decoration: ShapeDecoration(
                            color: Color(0xFFF8A4A4),
                            shape: OvalBorder(),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 40,
                        top: 300,
                        child: Container(
                          width: 400,
                          height: 300,
                          decoration: BoxDecoration(
                            color: Colors.grey.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: FutureBuilder<String>(
                            future: _totalScore,
                            builder: (context, snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return Center(
                                    child: CircularProgressIndicator());
                              } else if (snapshot.hasError) {
                                return Center(
                                    child: Text('Error: ${snapshot.error}',
                                        style: TextStyle(
                                            fontSize: 16, color: Colors.red)));
                              } else {
                                int score =
                                    int.tryParse(snapshot.data ?? '0') ?? 0;
                                String performanceText;
                                if (score < 10) {
                                  performanceText = 'Not good';
                                } else if (score < 15) {
                                  performanceText = 'Good';
                                } else {
                                  performanceText = 'Very good';
                                }

                                return Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      "Your score in the test is: ${snapshot.data}",
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    SizedBox(height: 20),
                                    Text(
                                      performanceText,
                                      style: TextStyle(
                                        color: Colors.red,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    SizedBox(height: 40),
                                    ElevatedButton(
                                      onPressed: () {
                                         Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) =>
                           Performance(studentId: '65defb8f796124616d1ecdc2',),
                      ));
                                        // Add navigation or action here
                                      },
                                      child: Text('Go to Performance',
                                          style: TextStyle(fontSize: 16)),
                                      style: ElevatedButton.styleFrom(
                                        primary: Colors.blue,
                                        onPrimary: Colors.white,
                                      ),
                                    ),
                                  ],
                                );
                              }
                            },
                          ),
                        ),
                      ),


                      
                      Positioned(
                        left: 318,
                        top: 169,
                        child: Container(
                          width: 255,
                          height: 240,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDA3838), Color(0x00C7A8FC)],
                            ),
                            shape: OvalBorder(),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 283,
                        top: 144,
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDA3838), Color(0x00C7A8FC)],
                            ),
                            shape: OvalBorder(),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 172,
                        top: 0,
                        child: Container(
                          width: 129,
                          height: 117,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDA3838), Color(0x00C7A8FC)],
                            ),
                            shape: OvalBorder(),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: -65,
                top: 292,
                child: Container(
                  width: 129,
                  height: 117,
                  decoration: ShapeDecoration(
                    color: Color(0x5BC7A8FC),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 324,
                top: 364,
                child: Container(
                  width: 110,
                  height: 110,
                  decoration: ShapeDecoration(
                    color: Color(0x5BC7A8FC),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 55,
                top: 569,
                child: Container(
                  width: 300,
                  height: 300,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage("assets/result.png"),
                      fit: BoxFit.fill,
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
