from flask import Flask, request, jsonify
import os
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from mealpy.math_based.SCA import OriginalSCA
import numpy as np

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are allowed"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Check for missing values
    data = pd.read_csv(file_path)
    if data.isnull().any().any():
        return jsonify({"missing": True, "file_path": file_path, "file_name": file.filename}), 200

    return jsonify({"missing": False, "file_path": file_path, "file_name": file.filename}), 200

@app.route('/imputate', methods=['POST'])
def imputate_data():
    request_data = request.json
    file_path = request_data.get('file_path')
    file_name = request_data.get('file_name')
    classifier_type = request_data.get('classifier')

    if not file_path or not file_name or not classifier_type:
        return jsonify({"error": "Missing parameters"}), 400

    # Load the data
    data = pd.read_csv(file_path)

    # Separate features and target
    X = data.iloc[:, :-1].values
    y = data.iloc[:, -1].values if data.shape[1] > 1 else None

    # Replace missing values with NaN
    X = np.array([[np.nan if pd.isnull(val) else val for val in row] for row in X])

    # Define fitness function
    def fitness_function(solution):
        imputed_X = X.copy()
        for i in range(X.shape[0]):
            for j in range(X.shape[1]):
                if np.isnan(X[i, j]):
                    imputed_X[i, j] = solution[j]

        if classifier_type == "knn":
            clf = KNeighborsClassifier(n_neighbors=5)
            clf.fit(imputed_X, y)
            accuracy = clf.score(imputed_X, y)
            return -accuracy

        return float("inf")  # Placeholder for unsupported classifiers

    # Run SCA optimization
    problem = {
        "fit_func": fitness_function,
        "lb": [np.nanmin(X[:, j]) if not np.isnan(X[:, j]).all() else 0 for j in range(X.shape[1])],
        "ub": [np.nanmax(X[:, j]) if not np.isnan(X[:, j]).all() else 1 for j in range(X.shape[1])],
        "minmax": "min",
        "log_to": None
    }

    model = OriginalSCA(problem, epoch=100, pop_size=30)
    best_solution, best_fitness = model.solve()

    # Apply best solution
    for i in range(X.shape[0]):
        for j in range(X.shape[1]):
            if np.isnan(X[i, j]):
                X[i, j] = best_solution[j]

    # Save the imputed dataset
    imputed_data = pd.DataFrame(X, columns=data.columns[:-1])
    if y is not None:
        imputed_data[data.columns[-1]] = y

    imputed_file_path = os.path.join(UPLOAD_FOLDER, f"imputed_{file_name}")
    imputed_data.to_csv(imputed_file_path, index=False)

    return jsonify({
        "file_path": imputed_file_path,
        "file_name": f"imputed_{file_name}",
        "f1_score": None,  # Placeholder until F1 score implementation
        "accuracy": -best_fitness,
        "loss": best_fitness
    }), 200

if __name__ == '__main__':
    app.run(debug=True)