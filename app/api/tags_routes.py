from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Tag, NoteTag, Notes
from datetime import datetime
from sqlalchemy.exc import IntegrityError

tag_routes = Blueprint("tags", __name__)

# Get all tags for a specific note
@tag_routes.route('/<int:note_id>/tags', methods=['GET'])
@login_required
def get_tags_for_note(note_id):
    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    tags = Tag.query.join(NoteTag).filter(NoteTag.note_id == note_id).all()
    return jsonify([tag.to_dict() for tag in tags]), 200


# Add a tag to a note
@tag_routes.route('/<int:note_id>/tags', methods=['POST'])
@login_required
def add_tag_to_note(note_id):
    data = request.get_json()
    tag_name = data.get("name")

    if not tag_name:
        return jsonify({"error": "Tag name is required"}), 400

    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Check if tag exists, if not create it
    tag = Tag.query.filter_by(name=tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
        db.session.commit()

    # Check if the tag is already linked to the note
    existing_notetag = NoteTag.query.filter_by(note_id=note_id, tag_id=tag.id).first()
    if existing_notetag:
        return jsonify({"error": "Tag already added to this note"}), 400

    # Link the tag to the note
    new_notetag = NoteTag(note_id=note_id, tag_id=tag.id)
    db.session.add(new_notetag)
    db.session.commit()

    return jsonify({"message": "Tag added successfully", "tag": tag.to_dict()}), 201


# Remove a tag from a note
@tag_routes.route('/<int:note_id>/tags', methods=['DELETE'])
@login_required
def delete_tag_from_note(note_id):
    data = request.get_json()
    tag_name = data.get("name")

    if not tag_name:
        return jsonify({"error": "Tag name is required"}), 400

    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    tag = Tag.query.filter_by(name=tag_name).first()

    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    notetag = NoteTag.query.filter_by(note_id=note_id, tag_id=tag.id).first()

    if not notetag:
        return jsonify({"error": "Tag is not attached to this note"}), 400

    db.session.delete(notetag)
    db.session.commit()

    return jsonify({"message": "Tag removed successfully"}), 200
