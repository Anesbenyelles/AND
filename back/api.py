import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler
import io
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score
from sklearn.neighbors import KNeighborsClassifier
from mealpy import SCA, PSO, GA, GWO, WOA
from mealpy.utils.space import FloatVar
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cela autorise toutes les origines

@app.route("/optimazation-methods-using-knn-classifier", methods=['POST'])
def optimazation_methods_using_knn_classifier():
    print("Optimazation methods using knn classifier")
    # Check if a file is uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only .csv files are supported"}), 400

    # Read the uploaded file into a DataFrame
    data = pd.read_csv(io.BytesIO(file.read()))

    # Dividing the data
    df_with_nulls = data[data.isnull().any(axis=1)]
    df_without_nulls = data[data.notnull().all(axis=1)]
    
    # Separating features (X) and labels (y)
    X = df_without_nulls.drop(columns=["Potability"])
    y = df_without_nulls["Potability"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Initializing the classifier
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)

    # Evaluating performances before optimization
    y_pred_initial = knn.predict(X_test)
    initial_results = {
        "accuracy": accuracy_score(y_test, y_pred_initial),
        "recall": recall_score(y_test, y_pred_initial, average="macro", zero_division=0),
        "precision": precision_score(y_test, y_pred_initial, average="macro", zero_division=0),
        "f1_score": f1_score(y_test, y_pred_initial, average="macro", zero_division=0)
    }

    # Filling missing values function
    def fill_missing_values(solution):
        df_filled = df_with_nulls.copy()
        for i, col in enumerate(df_with_nulls.columns[:-1]):
            df_filled[col] = df_filled[col].fillna(solution[i])
        return df_filled

    # Fitness function
    def fitness_function(solution, model):
        df_filled = fill_missing_values(solution)
        X_combined = pd.concat([X_test, df_filled.iloc[:, :-1]])
        y_combined = pd.concat([y_test, df_filled.iloc[:, -1]])
        y_pred_combined = model.predict(X_combined)
        return accuracy_score(y_combined, y_pred_combined)

    # Bounds for optimization
    lb = [min(df_without_nulls[col].min(), df_without_nulls[col].max()) for col in df_with_nulls.columns[:-1]]
    ub = [max(df_without_nulls[col].min(), df_without_nulls[col].max()) for col in df_with_nulls.columns[:-1]]
    bounds = FloatVar(lb=lb, ub=ub, name="delta")

    # Optimization methods
    optimization_methods = {
        "SCA": SCA.OriginalSCA(epoch=1, pop_size=30),
        "PSO": PSO.OriginalPSO(epoch=1, pop_size=30),
        "GA": GA.BaseGA(epoch=1, pop_size=30),
        "GWO": GWO.OriginalGWO(epoch=1, pop_size=30),
        "WOA": WOA.OriginalWOA(epoch=1, pop_size=30)
    }

    # Storing results after optimization
    results_after_optimization = {}
    for method_name, optimizer in optimization_methods.items():
        problem_dict = {
            "bounds": bounds,
            "minmax": "max",
            "obj_func": lambda solution: fitness_function(solution, knn)
        }
        best_agent = optimizer.solve(problem_dict)
        best_solution = best_agent.solution

        df_filled_best = fill_missing_values(best_solution)
        X_combined = pd.concat([X_test, df_filled_best.iloc[:, :-1]])
        y_combined = pd.concat([y_test, df_filled_best.iloc[:, -1]])
        y_pred_combined = knn.predict(X_combined)

        results_after_optimization[method_name] = {
            "accuracy": accuracy_score(y_combined, y_pred_combined),
            "recall": recall_score(y_combined, y_pred_combined, average="macro", zero_division=0),
            "precision": precision_score(y_combined, y_pred_combined, average="macro", zero_division=0),
            "f1_score": f1_score(y_combined, y_pred_combined, average="macro", zero_division=0)
        }

    # Return results as JSON
    print("results_after_optimization") 
    print(results_after_optimization)
    print("initial_results")
    print(initial_results)
    return jsonify({
        "Performances avant optimisation": initial_results,
        "Performances après optimisation": results_after_optimization
    })



@app.route("/optimazation-methods-using-mlp-classifier", methods=['POST'])
def optimazation_methods_using_mlp_classifier():
    # Check if a file is uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only .csv files are supported"}), 400

    # Read the uploaded file into a DataFrame
    data = pd.read_csv(io.BytesIO(file.read()))

    # Dividing the data
    df_with_nulls = data[data.isnull().any(axis=1)]
    df_without_nulls = data[data.notnull().all(axis=1)]
    
    # Separating features (X) and labels (y)
    X = df_without_nulls.drop(columns=["Potability"])
    y = df_without_nulls["Potability"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Initializing the classifier
    mlp = MLPClassifier(hidden_layer_sizes=(10, 1), max_iter=1000, solver='adam', random_state=42)
    mlp.fit(X_train, y_train)

    # Evaluating performances before optimization
    y_pred_initial = mlp.predict(X_test)
    initial_results = {
        "accuracy": accuracy_score(y_test, y_pred_initial),
        "recall": recall_score(y_test, y_pred_initial, average="macro", zero_division=0),
        "precision": precision_score(y_test, y_pred_initial, average="macro", zero_division=0),
        "f1_score": f1_score(y_test, y_pred_initial, average="macro", zero_division=0)
    }

    # Filling missing values function
    def fill_missing_values(solution):
        df_filled = df_with_nulls.copy()
        for i, col in enumerate(df_with_nulls.columns[:-1]):
            df_filled[col] = df_filled[col].fillna(solution[i])
        return df_filled

    # Fitness function
    def fitness_function(solution, model):
        df_filled = fill_missing_values(solution)
        X_combined = pd.concat([X_test, df_filled.iloc[:, :-1]])
        y_combined = pd.concat([y_test, df_filled.iloc[:, -1]])
        y_pred_combined = model.predict(X_combined)
        return accuracy_score(y_combined, y_pred_combined)

    # Bounds for optimization
    lb = [min(df_without_nulls[col].min(), df_without_nulls[col].max()) for col in df_with_nulls.columns[:-1]]
    ub = [max(df_without_nulls[col].min(), df_without_nulls[col].max()) for col in df_with_nulls.columns[:-1]]
    bounds = FloatVar(lb=lb, ub=ub, name="delta")

    # Optimization methods
    optimization_methods = {
        "SCA": SCA.OriginalSCA(epoch=1, pop_size=30),
        "PSO": PSO.OriginalPSO(epoch=1, pop_size=30),
        "GA": GA.BaseGA(epoch=1, pop_size=30),
        "GWO": GWO.OriginalGWO(epoch=1, pop_size=30),
        "WOA": WOA.OriginalWOA(epoch=1, pop_size=30)
    }

    # Storing results after optimization
    results_after_optimization = {}
    for method_name, optimizer in optimization_methods.items():
        problem_dict = {
            "bounds": bounds,
            "minmax": "max",
            "obj_func": lambda solution: fitness_function(solution, mlp)
        }
        best_agent = optimizer.solve(problem_dict)
        best_solution = best_agent.solution

        df_filled_best = fill_missing_values(best_solution)
        X_combined = pd.concat([X_test, df_filled_best.iloc[:, :-1]])
        y_combined = pd.concat([y_test, df_filled_best.iloc[:, -1]])
        y_pred_combined = mlp.predict(X_combined)

        results_after_optimization[method_name] = {
            "accuracy": accuracy_score(y_combined, y_pred_combined),
            "recall": recall_score(y_combined, y_pred_combined, average="macro", zero_division=0),
            "precision": precision_score(y_combined, y_pred_combined, average="macro", zero_division=0),
            "f1_score": f1_score(y_combined, y_pred_combined, average="macro", zero_division=0)
        }

    # Return results as JSON
    return jsonify({
        "Performances avant optimisation": initial_results,
        "Performances après optimisation": results_after_optimization
    })


if __name__ == '__main__':
    app.run(debug=True)