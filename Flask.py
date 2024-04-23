from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

# Load models
models = {column: joblib.load(f'MLmodels/model_{column}.pkl') for column in ['Chapitre 1', 'Chapitre 2', 'Chapitre 3', 'Chapitre 4', 'Chapitre 5']}

def predict_missing_features(input_data, models):
    """Predict missing features using the trained models."""
    input_df = pd.DataFrame([input_data])  # Convert dict to DataFrame
    predictions = input_df.copy()
    
    for column in predictions.columns:
        if pd.isna(predictions[column]).any():  # Check if there are NaNs to predict
            model = models[column]
            # Make sure to drop the target column from the input
            filtered_predictions = predictions.drop(column, axis=1)
            predicted_value = model.predict(filtered_predictions)
            predictions[column] = predicted_value[0]  # Assuming model returns a numpy array
    
    return predictions.to_dict(orient='records')[0]

@app.route('/predict', methods=['POST'])
def predict():
    if not request.json:
        return jsonify({'error': 'Missing JSON in request'}), 400

    input_data = request.json
    try:
        predictions = predict_missing_features(input_data, models)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
