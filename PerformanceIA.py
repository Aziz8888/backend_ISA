import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.experimental import enable_iterative_imputer  # This is required
from sklearn.impute import IterativeImputer
from sklearn.pipeline import Pipeline
import numpy as np
import joblib

def load_and_preprocess_data(filepath):
    """Load and preprocess data."""
    df = pd.read_csv(filepath, on_bad_lines='skip')
    df.columns = df.columns.str.strip()  # Strip whitespace from headers
    return df

def normalize_and_split_data(df):
    """Normalize data and split into training and test sets, including an imputer for handling missing values."""
    models = {}
    scalers = {}
    column_names = df.columns.tolist()
    
    for column in column_names:
        X = df.drop(column, axis=1)
        y = df[column]

        # Create a pipeline with an imputer, a scaler, and a linear regression model
        pipeline = Pipeline([
            ('imputer', IterativeImputer(max_iter=10, random_state=42)),
            ('scaler', StandardScaler()),
            ('regressor', LinearRegression())
        ])
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        pipeline.fit(X_train, y_train)
        mse = mean_squared_error(y_test, pipeline.predict(X_test))
        print(f'Training completed for {column} with MSE: {mse}')
        
        models[column] = pipeline
        joblib.dump(pipeline, f'MLmodels/model_{column}.pkl')
        
    return models

def predict_missing_features(input_data, models):
    """Predict missing features using the trained models."""
    input_df = pd.DataFrame(input_data, index=[0])
    input_df.columns = input_df.columns.str.strip()
    predictions = input_df.copy()
    
    for column in predictions.columns:
        if pd.isna(predictions[column]).any():  # Check if there are NaNs to predict
            model = models[column]
            predicted_value = model.predict(predictions.drop(column, axis=1))
            predictions[column] = predicted_value
    
    return predictions

def main(filepath):
    df = load_and_preprocess_data(filepath)
    models = normalize_and_split_data(df)
    print("Models trained and saved for each column.")

    # Example usage for prediction with missing values
    test_data = {"Chapitre 1": np.nan, "Chapitre 2": 92, "Chapitre 3": np.nan, "Chapitre 4": 90, "Chapitre 5": 88}
    complete_data = predict_missing_features(test_data, models)
    print(complete_data)

if __name__ == "__main__":
    main('data.csv')
