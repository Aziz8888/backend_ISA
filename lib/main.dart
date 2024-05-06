import 'package:flutter/material.dart';
import 'package:performance/Studenthome.dart';
import 'package:performance/performance.dart';
import 'package:performance/quiz.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:performance/qa.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_analytics/firebase_analytics.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Ensure the correct initialization of Firebase when the message is handled
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  print("Handling a background message: ${message.messageId}");
}
void getToken() async {
  FirebaseMessaging messaging = FirebaseMessaging.instance;
  String? token = await messaging.getToken();
  print("Device Token: $token");
  // You might want to send this token to your server or use it directly from here to test notifications.
}
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  // Set up the background message handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  getToken();
    final FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyApp Demo',
      debugShowCheckedModeBanner: false,
      initialRoute: '/',  // Définition de la route initiale
      routes: {
        '/': (context) => const SceneStudentHome(email: 'example@email.com'), // Route initiale
       
      },
    );
  }
}
