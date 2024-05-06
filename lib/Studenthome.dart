import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:fl_chart/fl_chart.dart'; // Importer le package fl_chart
import 'package:performance/model/question.dart';
import 'package:performance/resultatQuiz.dart';
import 'package:performance/test.dart';
import 'side_menu.dart'; // Import the side_menu.dart file
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // pour utiliser json.decode
import 'package:table_calendar/table_calendar.dart';

class TestInfo {
  final String? id;
  final String? title;
  final String? description;
  final DateTime? date;
  final List<String>? chapters;

  const TestInfo({
    this.id,
    this.title,
    this.description,
    this.date,
    this.chapters,
  });

  // Le constructeur nommé 'fromJson' pour créer une instance à partir de JSON
  factory TestInfo.fromJson(Map<String, dynamic> json) {
    return TestInfo(
      id: json['_id'] as String? ??
          '', // Note: Using '_id' from your JSON response
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      date: json['testDate'] == null
          ? null
          : DateTime.parse(json['testDate'] as String),
      chapters: [], // Based on your JSON, it looks like chapters might not be included
    );
  }
}

Future<List<TestInfo>> getAllTests() async {
  final response =
      await http.get(Uri.parse('http://10.0.2.2:50689/test/getAllTests'));
  print('Response body: ${response.body}');

  if (response.statusCode == 200) {
    List<dynamic> testsJson = json.decode(response.body);
    return testsJson.map((json) => TestInfo.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load tests');
  }
}

Future<List<Question>> getQuestionsByTestId(String? testId) async {

  final response =
      await http.get(Uri.parse('http://10.0.2.2:50689/test/tests/$testId/'));

  if (response.statusCode == 200) {
    // Convertir la réponse en JSON et extraire les questions.
    var data = json.decode(response.body);
    List<Question> questions = (data['questions'] as List)
        .map((questionJson) => Question.fromJson(questionJson))
        .toList();
    return questions;
  } else {
    // Gérer l'erreur si la réponse n'est pas OK.
    throw Exception(
        'Failed to load questions for the test with title: $testId');
  }
}

Future<List<String>> getChaptersByTestId(String testId) async {
  final response = await http
      .get(Uri.parse('http://10.0.2.2:50689/test/tests/$testId/chapters'));

  if (response.statusCode == 200) {
    List<dynamic> chaptersJson = json.decode(response.body);
    return List<String>.from(chaptersJson);
  } else {
    throw Exception('Failed to load chapters');
  }
}

class SceneStudentHome extends StatelessWidget {
  final String email;

  // Constructeur pour recevoir l'e-mail de l'utilisateur
  const SceneStudentHome({Key? key, required this.email}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
    double fem = screenWidth / 411;
    String userName = email.split('@')[0]; // Extract user name from email

    return Scaffold(
      body: SingleChildScrollView(
        child: Stack(
          children: [
            Container(
              width: double.infinity,
              height: screenHeight,
              decoration: BoxDecoration(
                color: Color(0xfff4f2f6),
              ),
            ),
            Positioned(
              left: 0,
              top: 0,
              child: Container(
                width: screenWidth,
                height: screenHeight,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18 * fem),
                  gradient: LinearGradient(
                    begin: Alignment(0, -1),
                    end: Alignment(0, 1),
                    colors: [Color(0xffdf0b0b), Color(0x00f6f1fb)],
                    stops: [0, 1],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(height: 25 * fem),
                    Text(
                      "Welcome, $userName",
                      style: TextStyle(
                        fontSize: 25 * fem,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    Expanded(
                      child: FutureBuilder<List<TestInfo>>(
                        future: getAllTests(),
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          } else if (snapshot.hasError) {
                            return Text('Error: ${snapshot.error}');
                          } else if (snapshot.hasData) {
                            Map<DateTime, List<TestInfo>> testsByDate = {};
                            for (var test in snapshot.data!) {
                              if (test.date != null) {
                                final testDate = DateTime(test.date!.year,
                                    test.date!.month, test.date!.day);
                                testsByDate
                                    .putIfAbsent(testDate, () => [])
                                    .add(test);
                              }
                            }

                            return SingleChildScrollView(
                              child: Column(
                                 mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  ListView.builder(
                                    shrinkWrap: true,
                                    physics: NeverScrollableScrollPhysics(),
                                    itemCount: snapshot.data!.length,
                                    itemBuilder: (context, index) {
                                      return buildTestButton(
                                          context, snapshot.data![index], fem);
                                    },
                                  ),
                                  TableCalendar(
  firstDay: DateTime.utc(2020, 10, 16),
  lastDay: DateTime.utc(2030, 3, 14),
  focusedDay: DateTime.now(),
  eventLoader: (day) {
    // Assuming 'testsByDate' is a Map<DateTime, List<dynamic>>
    return testsByDate[DateTime(day.year, day.month, day.day)] ?? [];
  },
  calendarBuilders: CalendarBuilders(
    markerBuilder: (context, date, events) {
      if (events.isNotEmpty) {
        bool isPast = date.isBefore(DateTime.now());
        return Positioned(
          right: 1,
          bottom: 1,
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isPast ? Colors.red : Colors.green, // Red for past, green for future
            ),
            width: 7,
            height: 7,
          ),
        );
      }
      return null;
    },
  ),
  calendarStyle: CalendarStyle(
    todayDecoration: BoxDecoration(
      color: Colors.purpleAccent,
      shape: BoxShape.circle,
    ),
    markerDecoration: BoxDecoration(
      color: Colors.red,
      shape: BoxShape.circle,
    ),
  ),
),

                                ],
                              ),
                            );
                          } else {
                            return Text('No tests found');
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
Widget buildTestButton(BuildContext context, TestInfo test, double fem) {
  // Determine if the test date is in the past, today, or in the future
  DateTime now = DateTime.now();
  bool isToday = test.date != null && 
                 test.date!.year == now.year && 
                 test.date!.month == now.month && 
                 test.date!.day == now.day;
  bool isPast = test.date != null && test.date!.isBefore(DateTime(now.year, now.month, now.day));

  // Set button color based on whether it is today
  Color buttonColor = isToday ? Color(0xff9b59b6) : Colors.grey;

  return Container(
    margin: EdgeInsets.only(bottom: 10),
    child: FutureBuilder<List<String>>(
      future: getChaptersByTestId(test.id ?? ''),
      builder: (context, snapshot) {
        List<String> chapters = snapshot.data ?? [];

        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: isToday ? () async {  // Only enable button if today
                    try {
                      List<Question> questions = await getQuestionsByTestId(test.id!);
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => TestPage(questions: questions, testId: test.id!),
                      ));
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text('Error: Unable to load questions for this test.'),
                      ));
                    }
                } : null,
                child: Text(
                  "${test.description}\nDate: ${test.date != null ? DateFormat('yyyy-MM-dd').format(test.date!) : 'No date provided'}\nChapters: ${chapters.join(', ')}",
                  style: TextStyle(fontSize: 16 * fem),
                ),
                style: ElevatedButton.styleFrom(
                  primary: buttonColor,
                  onPrimary: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 30 * fem, vertical: 20 * fem),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5 * fem),
                  ),
                ),
              ),
            ),
            if (isPast)  // Show history icon only if the date is in the past
              IconButton(
                icon: Icon(Icons.history, size: 24 * fem),
                onPressed: () {
                  Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => ResultQuiz(studentId: '65df009a796124616d1ecdce', testId: test.id!),
                  ));
                },
              ),
          ],
        );
      },
    ),
  );
}



}
