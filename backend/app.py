from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from db import createDB, userLogin, getUsers, getChats, chatAdd

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}

@socketio.on('message')
def handle_message(data):
    # toMsg = data['to']
    # fromMsg = data['from']
    # msg = data['msg']
    #currentTime = time.Time()
    chatAdd(data)
    socketio.emit('message', data)


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        if 'username' in data and 'avatar' in data:
            user = userLogin(data['username'], data['avatar'])
            return {'token':user, 'access':True}
        return {'access':False}
    
@app.route('/users', methods=['GET'])
def get_users():
    if request.method == 'GET':
        all_users = getUsers()
        
        # Convert all users to a list of JSON-serializable dictionaries using the custom method
        users_list = [user.to_dict() for user in all_users]

        # Convert the list of dictionaries to a JSON string
        users_json = json.dumps(users_list, indent=2)
        data = {"users":users_json}
        return users_json
    
@app.route('/chats', methods=['GET'])
def get_chats():
    if request.method == 'GET':
        all_chats = getChats()
        
        # Convert all chats to a list of JSON-serializable dictionaries using the custom method
        chats_list = [chat.to_dict() for chat in all_chats]

        # Convert the list of dictionaries to a JSON string
        chats_json = json.dumps(chats_list, indent=2)

        return chats_json

# @app.route('/')
# def index():
#     return render_template('index.html')

# @socketio.on('connect')
# def handle_connect():
#     print('User connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('User disconnected')

# @socketio.on('message')
# def handle_message(data):
#     emit('message', data, broadcast=True)

# @socketio.on('user_data')
# def handle_user_data(data):
#     user_id = request.sid
#     users[user_id] = data
#     emit('user_list', list(users.values()), broadcast=True)

if __name__ == '__main__':
    createDB()
    # app.run(debug=True, host='localhost', port=8000)
    socketio.run(app)
