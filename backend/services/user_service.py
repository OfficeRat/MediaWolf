from db.user_db_handler import UserDBHandler
from logger import logger
from dataclasses import asdict
import bcrypt

class UserService:
    def __init__(self):
        self.user_db_handler = UserDBHandler() 

    def get_all_users(self):
        """Fetch all users from the database."""
        users = self.user_db_handler.get_existing_user()
        #logger.info(users)
        return users
    
    def get_user_by_id(self, id):
        """Get user by ID"""
        user = self.user_db_handler.get_user_by_id(id)
        
        return user

    def update_user(self, data):
        """Update user from form on User Page"""
        user_id = data.get("id")
        old_user_data = self.user_db_handler.get_user_by_id(user_id)
        logger.info(old_user_data)
    
        if not old_user_data:
            pass
    
        updates = {}
    
        for key, new_value in data.items():
            old_value = getattr(old_user_data, key, None)

            if key == "password":
                if not new_value:  # Skip password update if it's empty
                    continue
                new_value = bcrypt.hashpw(new_value.encode('utf-8'), bcrypt.gensalt())

            if new_value != old_value:  # Only update changed values
                updates[key] = new_value
    
        if updates:
            
            self.user_db_handler.update_user(user_id, updates)  # Apply changes
            return

