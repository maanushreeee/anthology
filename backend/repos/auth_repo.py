# from models.auth import UserInDB
# from services.auth_service import verify_password


# def get_user(db, username: str):
#     users = db.users
#     user = users.find_one({"username": username})
#     if user:
#         user_dict = db[username]
#         return UserInDB(**user_dict)
#     return None


# def authenticate_user(db, username: str, password: str):
#     users = db.users
#     user = users.find_one({"username": username})
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user

