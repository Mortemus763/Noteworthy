from flask import Blueprint, jsonify, request
from app.models import Task, Notebook
from flask_login import current_user, login_required
from app.models.db import db
from datetime import datetime

tasks_routes = Blueprint('tasks', __name__)


# get all tasks belonging to the current user
@tasks_routes.route('/current', methods=['GET'])
@login_required
def current_tasks():
    notebook_ids = [id[0] for id in Notebook.query.with_entities(Notebook.id).filter(Notebook.user_id == current_user.id).all()]

    tasks = Task.query.filter(Task.notebook_id.in_(notebook_ids)).all()

    return jsonify([task.to_dict() for task in tasks])

# Create a new task
@tasks_routes.route('/new', methods=['POST'])
@login_required
def new_task():
    data = request.json

    if not data or not data.get('title'):
        return jsonify({"message": "Title is required"}), 400

    if not data or not data.get('notebook_id'):
        return jsonify({"message": "Notebook id is required"}), 400

    task_data = {
        'title': data['title'],
        'notebook_id': data['notebook_id'],
    }

    if 'description' in data:
        task_data['description'] = data['description']

    if 'completed' in data:
        task_data['completed'] = data['completed']

    if 'due_date' in data:
         task_data["due_date"] = datetime.strptime(data["due_date"], "%m/%d/%Y").date()

    task = Task(**task_data)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict())


# Delete a task
@tasks_routes.route('/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return jsonify({"message": "Task not found"}), 404

    notebook = Notebook.query.get(task.notebook_id)

    if notebook.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task has been deleted successfully"})

# Update a task
@tasks_routes.route('<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return jsonify({"message": "Task not found"}), 404

    notebook = Notebook.query.get(task.notebook_id)

    if notebook.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json

    if not data:
        return jsonify({"message": "Invalid request"}), 400

    if 'title' in data:
        task.title = data['title']

    if 'description' in data:
        task.description = data['description']

    if 'due_date' in data:
        task.due_date = data['due_date']

    if 'completed' in data:
        task.completed = data['completed']

    if 'due_date' in data:
        task.due_date = datetime.strptime(data['due_date'], "%m/%d/%Y").date() if data['due_date'] else None

    db.session.commit()

    return jsonify(task.to_dict())

# Get all tasks within a notebook
@tasks_routes.route('/notebook/<int:notebook_id>', methods=['GET'])
@login_required
def notebook_tasks(notebook_id):
    notebook = Notebook.query.get(notebook_id)

    if notebook is None:
        return jsonify({"message": "Notebook not found"}), 404

    if notebook.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    tasks = Task.query.filter(Task.notebook_id == notebook_id).all()

    return jsonify([task.to_dict() for task in tasks])

#laskjfdhlasdf
