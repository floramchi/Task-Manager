from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication

# MongoDB connection using URI from environment variable
mongo_uri = os.getenv("MONGO_URI")  # Get MONGO_URI from .env file
client = MongoClient(mongo_uri)
db = client["task_manager_db"]
tasks_collection = db["tasks"]

# Home Route (render HTML template)
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

# Add a new task
@app.route("/add_task", methods=["POST"])
def add_task():
    data = request.json
    task = {"text": data["text"], "category": data["category"], "completed": False}
    result = tasks_collection.insert_one(task)
    return jsonify({"message": "Task added", "id": str(result.inserted_id)}), 201

# Get all tasks
@app.route("/get_tasks", methods=["GET"])
def get_tasks():
    tasks = []
    for task in tasks_collection.find():
        task["_id"] = str(task["_id"])
        tasks.append(task)
    return jsonify(tasks), 200

# Update task (mark as complete/incomplete)
@app.route("/update_task/<id>", methods=["PUT"])
def update_task(id):
    data = request.json
    updated_data = {"$set": {"completed": data["completed"]}}
    tasks_collection.update_one({"_id": ObjectId(id)}, updated_data)
    return jsonify({"message": "Task updated"}), 200

# Delete task
@app.route("/delete_task/<id>", methods=["DELETE"])
def delete_task(id):
    tasks_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
     app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
