import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart'; // Import the fl_chart package
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:spider_chart/spider_chart.dart';

class Performance extends StatefulWidget {
  final String studentId; // ID de l'étudiant comme paramètre du widget
  const Performance({Key? key, required this.studentId}) : super(key: key);

  @override
  _PerformanceState createState() => _PerformanceState();
}

class _PerformanceState extends State<Performance> {
  Map<String, double>? scores;
  bool isLoading = true;
  Map<String, double>? predictedScores;

  
@override
  void initState() {
    super.initState();
    fetchScores();
  }
  

   Future<void> fetchScores() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:50711/note/scores/${widget.studentId}'));
      if (response.statusCode == 200) {
        print('yessss');
        var data = jsonDecode(response.body) as Map<String, dynamic>;
        Map<String, double> formattedScores = {};
        Map<String, String> chapterMapping = {
          "Les classes et les objets": "Chapitre 1",
          "L'héritage": "Chapitre 2",
          "Le polymorphisme": "Chapitre 3",
          "Les interfaces": "Chapitre 4",
          "Encapsulation": "Chapitre 5"
        };
        data.forEach((key, value) {
          String? chapterName = chapterMapping[key];
          if (chapterName != null) {
            formattedScores[chapterName] = value.toDouble();
          }
        });
        setState(() {
          scores = formattedScores;
          print(scores);
          isLoading = false;
        });
        Map<String, double?> preparedData = prepareDataForPrediction(formattedScores);

// Envoyer les données pour la prédiction
      sendPredictRequest(preparedData);
      } else {
        throw Exception('Failed to load scores');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print("Error fetching scores: $e");
    }
    
  }
  Map<String, double?> prepareDataForPrediction(Map<String, double> scores) {
  Map<String, double?> fullData = {
    "Chapitre 1": null,
    "Chapitre 2": null,
    "Chapitre 3": null,
    "Chapitre 4": null,
    "Chapitre 5": null
  };

  fullData.forEach((key, _) {
    if (scores.containsKey(key)) {
      fullData[key] = scores[key];
    }
  });

  return fullData;
  print(fullData);
}

Future<void> sendPredictRequest(Map<String, double?> preparedData) async {
  final url = Uri.parse('http://10.0.2.2:5000/predict');
  final headers = {"Content-Type": "application/json"};
  final body = json.encode(preparedData);

  try {
    final response = await http.post(url, headers: headers, body: body);
    if (response.statusCode == 200) {
      var responseData = jsonDecode(response.body) as Map;
      Map<String, double> mappedResponseData = {};
      responseData.forEach((key, value) {
        // Ensure that the value is a double before adding it to the new map
        if (value != null) {
          mappedResponseData[key as String] = (value is int) ? value.toDouble() : value as double;
        }
      });
      setState(() {
        predictedScores = mappedResponseData;
      });
      print('Prediction response: $mappedResponseData');
    } else {
      throw Exception('Failed to get prediction');
    }
  } catch (e) {
    print('Error sending prediction request: $e');
  }
}

  @override
  Widget build(BuildContext context) {
  List<double> realData = scores?.values.toList() ?? [0, 0, 0, 0, 0]; // Default values if scores are null
    List<double> predictedData = predictedScores?.values.toList() ?? [0, 0, 0, 0, 0]; // If predictedScores is null, use default values.

  // Define a list of colors that should be used for the chart.
  List<Color> chartColors = [
    Colors.red, // Color for Chapitre 1
    Colors.green, // Color for Chapitre 2
    Colors.blue, // Color for Chapitre 3
    Colors.yellow, // Color for Chapitre 4
    Colors.purple, // Color for Chapitre 5
  ];

  // The list of colors must match the length of the predicted data.
  // If you have more data points than colors, you need to repeat or adjust the colors accordingly.
  if (predictedData.length != chartColors.length) {
    throw Exception('The number of predicted data points must match the number of colors.');
  }

    return Scaffold(
      body: Container(
        width: double
            .infinity, // Permet au conteneur de prendre toute la largeur de l'écran
        height: double
            .infinity, // Permet au conteneur de prendre toute la hauteur de l'écran
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(color: Color.fromARGB(255, 159, 137, 137)),
        child: Stack(
          children: [
            Positioned(
              left: 0,
              top: 0,
              child: Container(
                width: 415,
                height: 343,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment(0.00, -1.00),
                    end: Alignment(0, 1),
                    colors: [Color(0xFFF92626), Color.fromARGB(0, 230, 198, 198)],
                  ),
                ),
              ),
            ),
            Positioned(
              left: -90,
              top: -106,
              child: Container(
                width: 272,
                height: 263,
                child: Stack(
                  children: [
                    Positioned(
                      left: 0,
                      top: 63,
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: ShapeDecoration(
                          color: Color.fromARGB(113, 171, 190, 190),
                          shape: CircleBorder(),
                        ),
                      ),
                    ),
                    Positioned(
                      left: 72,
                      top: 0,
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: ShapeDecoration(
                          color: Color.fromARGB(104, 136, 157, 155),
                          shape: CircleBorder(),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
         
        Positioned(
          left: 25,
          top: 160,
          child: Container(
            width: 300,
            height: 300,
            child: SpiderChart(
              data: predictedData,
              maxValue: 100,
              colors: chartColors,
            ),
          ),
        ),
            Positioned(
              left: 80, // Adjust position as needed
              top: 450, // Adjust position as needed
              child: Column(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "Chapter 1",
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 130, // Adjust position as needed
              top: 450, // Adjust position as needed
              child: Column(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.green,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "Chapter 2",
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 180, // Adjust position as needed
              top: 450, // Adjust position as needed
              child: Column(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "Chapter 3",
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 230, // Adjust position as needed
              top: 450, // Adjust position as needed
              child: Column(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.yellow,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "Chapter 4",
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 280, // Adjust position as needed
              top: 450, // Adjust position as needed
              child: Column(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.indigo,
                      shape: BoxShape.circle,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "Chapter 5",
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 20,
              top: 150,
              child: SizedBox(
                width: 95,
                child: Text(
                  'Performance :',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 12,
                    fontFamily: 'Roboto',
                    fontWeight: FontWeight.w700,
                    height: 0,
                  ),
                ),
              ),
            ),
            Positioned(
              left: 20,
              top: 500,
              child: SizedBox(
                width: 114,
                child: Text(
                  'Recommendation',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 12,
                    fontFamily: 'Roboto',
                    fontWeight: FontWeight.w700,
                    height: 0,
                  ),
                ),
              ),
            ),
            Positioned(
              left: 25,
              top: 526,
              child: Container(
                width: 325,
                height: 184,
                decoration: ShapeDecoration(
                  color: Color(0xB5D2D2D2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(13),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}




