class Question {
  final int? complexity;
  final String? question;
  final String? response;
  final int? marks;
  final List<String>? options; // Modification ici pour que les options soient une List<String>
  final String? chapitre;
  final String? type;
  final String? image;

  Question({
    this.complexity,
    this.question,
    this.response,
    this.marks,
    this.options, // Modification ici également
    this.chapitre,
    this.type,
    this.image,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    // Gérer la conversion de la chaîne d'options en List<String>
    var optionsFromJson = json['options'];
    List<String> optionsList = [];
    if (optionsFromJson != null) {
      if (optionsFromJson is String) {
        optionsList = optionsFromJson.split(',').map((str) => str.trim()).toList();
      } else if (optionsFromJson is List) {
        optionsList = List<String>.from(optionsFromJson.map((str) => str as String));
      }
    }

    return Question(
      complexity: json['complexity'] as int?,
      question: json['question'] as String?,
      response: json['response'] as String?,
      marks: json['marks'] as int?,
      options: optionsList, // Utilisation de la liste créée à partir du JSON
      chapitre: json['chapitre'] as String?,
      type: json['type'] as String?,
      image: json['image'] as String?,
    );
  }
}
